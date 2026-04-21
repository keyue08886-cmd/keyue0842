// ============================================
// 用户配置（管理员可修改）
// ============================================
const USERS = [
    { username: 'admin', password: 'admin123', role: 'admin', name: '管理员' },
    { username: 'zhangsan', password: '123456', role: 'user', name: '张三' },
    { username: 'lisi', password: '123456', role: 'user', name: '李四' },
    { username: 'wangwu', password: '123456', role: 'user', name: '王五' },
];

// ============================================
// 应用状态
// ============================================
let currentUser = null;
let clockRecords = JSON.parse(localStorage.getItem('clockRecords')) || {};

// ============================================
// 工具函数
// ============================================
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function formatDateTime(date) {
    return `${formatDate(date)} ${formatTime(date)}`;
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// ============================================
// 时间显示
// ============================================
function updateClock() {
    const now = new Date();
    document.getElementById('currentDate').textContent = formatDate(now);
    document.getElementById('currentTime').textContent = formatTime(now);
}

// ============================================
// 登录功能
// ============================================
function login(username, password) {
    const user = USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLoginPage();
}

function checkLogin() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        // 验证用户是否还存在（防止用户被删除后还能登录）
        const userExists = USERS.find(u => u.username === currentUser.username);
        if (userExists) {
            return true;
        } else {
            logout();
            return false;
        }
    }
    return false;
}

// ============================================
// 打卡功能
// ============================================
function clockIn() {
    if (!currentUser) return;
    
    const now = new Date();
    const dateKey = formatDate(now);
    const userKey = currentUser.username;
    
    // 初始化用户记录
    if (!clockRecords[userKey]) {
        clockRecords[userKey] = {};
    }
    
    // 检查今天是否已打卡
    if (clockRecords[userKey][dateKey] && clockRecords[userKey][dateKey].clockIn) {
        showError('今日已打过上班卡');
        return;
    }
    
    // 记录打卡
    if (!clockRecords[userKey][dateKey]) {
        clockRecords[userKey][dateKey] = {};
    }
    clockRecords[userKey][dateKey].clockIn = formatDateTime(now);
    
    // 保存到localStorage
    localStorage.setItem('clockRecords', JSON.stringify(clockRecords));
    
    showSuccess('上班打卡成功！' + formatTime(now));
    updateUI();
}

function clockOut() {
    if (!currentUser) return;
    
    const now = new Date();
    const dateKey = formatDate(now);
    const userKey = currentUser.username;
    
    // 检查是否已打上班卡
    if (!clockRecords[userKey] || !clockRecords[userKey][dateKey] || !clockRecords[userKey][dateKey].clockIn) {
        showError('请先打上班卡');
        return;
    }
    
    // 检查是否已打下班卡
    if (clockRecords[userKey][dateKey].clockOut) {
        showError('今日已打过下班卡');
        return;
    }
    
    // 记录打卡
    clockRecords[userKey][dateKey].clockOut = formatDateTime(now);
    
    // 保存到localStorage
    localStorage.setItem('clockRecords', JSON.stringify(clockRecords));
    
    showSuccess('下班打卡成功！' + formatTime(now));
    updateUI();
}

// ============================================
// UI 更新
// ============================================
function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('clockPage').classList.remove('active');
    document.getElementById('loginError').textContent = '';
}

function showClockPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('clockPage').classList.add('active');
    
    // 更新欢迎信息
    document.getElementById('welcomeUser').textContent = `欢迎，${currentUser.name}`;
    
    updateUI();
}

function updateUI() {
    updateClock();
    updateClockStatus();
    updateTodayRecords();
    updateWeekRecords();
    updateStreak();
}

function updateClockStatus() {
    if (!currentUser) return;
    
    const now = new Date();
    const dateKey = formatDate(now);
    const userKey = currentUser.username;
    const userRecords = clockRecords[userKey] || {};
    const todayRecord = userRecords[dateKey] || {};
    
    const statusEl = document.getElementById('todayStatus');
    const clockInBtn = document.getElementById('clockInBtn');
    const clockOutBtn = document.getElementById('clockOutBtn');
    
    if (!todayRecord.clockIn) {
        statusEl.textContent = '未打卡';
        statusEl.style.color = '#eb3349';
        clockInBtn.disabled = false;
        clockOutBtn.disabled = true;
    } else if (!todayRecord.clockOut) {
        statusEl.textContent = '已上班打卡';
        statusEl.style.color = '#11998e';
        clockInBtn.disabled = true;
        clockOutBtn.disabled = false;
    } else {
        statusEl.textContent = '已完成打卡';
        statusEl.style.color = '#667eea';
        clockInBtn.disabled = true;
        clockOutBtn.disabled = true;
    }
}

function updateTodayRecords() {
    if (!currentUser) return;
    
    const now = new Date();
    const dateKey = formatDate(now);
    const userKey = currentUser.username;
    const userRecords = clockRecords[userKey] || {};
    const todayRecord = userRecords[dateKey] || {};
    
    const container = document.getElementById('todayRecords');
    
    if (!todayRecord.clockIn && !todayRecord.clockOut) {
        container.innerHTML = '<p class="no-data">暂无打卡记录</p>';
        return;
    }
    
    let html = '<div class="records">';
    
    if (todayRecord.clockIn) {
        html += `
            <div class="record-item">
                <span class="record-time">${todayRecord.clockIn}</span>
                <span class="record-type clock-in">上班</span>
            </div>
        `;
    }
    
    if (todayRecord.clockOut) {
        html += `
            <div class="record-item">
                <span class="record-time">${todayRecord.clockOut}</span>
                <span class="record-type clock-out">下班</span>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function updateWeekRecords() {
    if (!currentUser) return;
    
    const now = new Date();
    const weekStart = getWeekStart(now);
    const userKey = currentUser.username;
    const userRecords = clockRecords[userKey] || {};
    
    let html = '<div class="records">';
    let hasRecords = false;
    
    // 显示本周7天的记录
    for (let i = 6; i >= 0; i--) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateKey = formatDate(date);
        const record = userRecords[dateKey] || {};
        
        const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const dayName = dayNames[date.getDay()];
        
        html += `<div class="record-item">`;
        html += `<div><strong>${dateKey}</strong> ${dayName}</div>`;
        html += `<div>`;
        
        if (record.clockIn || record.clockOut) {
            hasRecords = true;
            if (record.clockIn) {
                html += `<span class="record-type clock-in">${record.clockIn.split(' ')[1].substring(0, 5)} 上班</span> `;
            }
            if (record.clockOut) {
                html += `<span class="record-type clock-out">${record.clockOut.split(' ')[1].substring(0, 5)} 下班</span>`;
            }
        } else {
            html += `<span style="color: #999;">未打卡</span>`;
        }
        
        html += `</div></div>`;
    }
    
    html += '</div>';
    
    if (!hasRecords) {
        document.getElementById('weekRecords').innerHTML = '<p class="no-data">暂无打卡记录</p>';
    } else {
        document.getElementById('weekRecords').innerHTML = html;
    }
}

function updateStreak() {
    if (!currentUser) return;
    
    const userKey = currentUser.username;
    const userRecords = clockRecords[userKey] || {};
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 从今天开始往前数连续打卡天数
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = formatDate(date);
        
        if (userRecords[dateKey] && (userRecords[dateKey].clockIn || userRecords[dateKey].clockOut)) {
            streak++;
        } else {
            break;
        }
    }
    
    document.getElementById('streakCount').textContent = streak;
}

// ============================================
// 消息提示
// ============================================
function showSuccess(msg) {
    const msgEl = document.getElementById('clockMsg');
    msgEl.textContent = msg;
    msgEl.className = 'msg success';
    
    setTimeout(() => {
        msgEl.textContent = '';
        msgEl.className = 'msg';
    }, 3000);
}

function showError(msg) {
    const msgEl = document.getElementById('clockMsg');
    msgEl.textContent = msg;
    msgEl.className = 'msg error';
    
    setTimeout(() => {
        msgEl.textContent = '';
        msgEl.className = 'msg';
    }, 3000);
}

// ============================================
// 事件绑定
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    if (checkLogin()) {
        showClockPage();
    } else {
        showLoginPage();
    }
    
    // 更新时间（每秒）
    setInterval(updateClock, 1000);
    
    // 登录表单
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (login(username, password)) {
            showClockPage();
            document.getElementById('password').value = '';
        } else {
            document.getElementById('loginError').textContent = '用户名或密码错误';
        }
    });
    
    // 退出登录
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // 打卡按钮
    document.getElementById('clockInBtn').addEventListener('click', clockIn);
    document.getElementById('clockOutBtn').addEventListener('click', clockOut);
});