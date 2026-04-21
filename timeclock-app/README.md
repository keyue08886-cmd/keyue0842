# 📅 每日打卡系统

一个简单、美观的打卡网页应用，支持手机和电脑访问。

## ✨ 功能特点

- 📱 响应式设计，手机电脑都能用
- 🔐 用户登录验证
- ⏰ 上班/下班打卡
- 📊 打卡记录查看
- 🏆 连续打卡统计
- 👨‍💼 管理员后台
- 📤 数据导出CSV

## 🚀 快速部署到 Vercel（推荐）

### 方法一：命令行部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 进入项目目录
cd timeclock-app

# 3. 登录并部署（首次需要登录）
vercel

# 按提示操作：
# - 登录 GitHub 账号
# - 选择项目目录
# - 等待部署完成
# - 获得 URL，如：https://timeclock-app.vercel.app
```

### 方法二：网页拖拽部署

1. 访问 https://vercel.com
2. 注册/登录（支持GitHub）
3. 点击 "Add New..." → "Project"
4. 拖拽 `timeclock-app` 文件夹到页面
5. 等待部署完成，获得URL

### 方法三：GitHub 自动部署

```bash
# 1. 创建 GitHub 仓库
# 访问 https://github.com/new 创建新仓库

# 2. 推送代码
git init
git add .
git commit -m "打卡系统"
git branch -M main
git remote add origin https://github.com/你的用户名/timeclock-app.git
git push -u origin main

# 3. 在 Vercel 导入
# 访问 https://vercel.com/new
# 选择 GitHub 仓库 "timeclock-app"
# 点击 "Deploy"
```

---

## 📖 使用说明

### 用户端

1. 访问部署的URL
2. 使用管理员提供的账号密码登录
3. 点击"上班打卡"或"下班打卡"
4. 查看打卡记录和连续打卡天数

### 管理员端

1. 访问 `你的URL/admin.html`
2. 使用管理员账号登录（默认：admin / admin123）
3. 查看打卡概览、所有记录、用户管理
4. 导出打卡数据为CSV

---

## 👥 默认用户账号

| 用户名 | 密码 | 角色 | 姓名 |
|--------|------|------|------|
| admin | admin123 | 管理员 | 管理员 |
| zhangsan | 123456 | 用户 | 张三 |
| lisi | 123456 | 用户 | 李四 |
| wangwu | 123456 | 用户 | 王五 |

---

## 🔧 修改用户账号

编辑 `app.js` 文件中的 `USERS` 数组：

```javascript
const USERS = [
    { username: 'admin', password: 'admin123', role: 'admin', name: '管理员' },
    { username: 'zhangsan', password: '123456', role: 'user', name: '张三' },
    // 添加更多用户...
];
```

修改后需要重新部署：

```bash
vercel --prod
```

---

## 📂 文件结构

```
timeclock-app/
├── index.html      # 用户打卡页面
├── admin.html      # 管理员后台页面
├── style.css       # 样式文件（响应式）
├── app.js          # 应用逻辑
├── vercel.json     # Vercel 配置
└── README.md       # 说明文档
```

---

## 🔒 安全说明

⚠️ **重要提示**：

- 当前版本使用浏览器 localStorage 存储数据
- 数据存储在用户浏览器本地，不同设备数据不同步
- 适合小团队（10人以内）使用
- 生产环境建议使用后端数据库

### 升级为生产版本（需要后端）

如需多人共享数据，建议升级方案：

1. **Supabase**（免费）- PostgreSQL + 用户认证
2. **Firebase**（免费额度）- NoSQL + 用户认证
3. **自建后端** - Node.js + MongoDB

---

## 🆘 常见问题

### Q: 打卡记录会丢失吗？

A: 打卡记录存储在浏览器 localStorage 中，除非清除浏览器数据，否则不会丢失。但换设备或浏览器后无法看到之前的数据。

### Q: 忘记密码怎么办？

A: 联系管理员查看 `app.js` 中的 `USERS` 数组获取账号密码。

### Q: 如何添加新用户？

A: 编辑 `app.js` 文件中的 `USERS` 数组，添加新用户后重新部署：

```javascript
{ username: 'newuser', password: 'password', role: 'user', name: '新用户' }
```

### Q: 如何修改管理员密码？

A: 修改 `app.js` 中 admin 用户的 password 字段，然后重新部署。

---

## 📞 技术支持

- 部署问题：查看 [Vercel 文档](https://vercel.com/docs)
- 项目问题：修改 `app.js` 源码

---

## 📄 License

MIT License - 自由使用和修改