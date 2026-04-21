import { Hono } from 'hono';
import dayjs from 'dayjs';

const checkinRouter = new Hono();

// 获取今日打卡状态
checkinRouter.get('/today-status', async (c) => {
  const { db, user } = c.env;
  const today = dayjs().format('YYYY-MM-DD');
  
  try {
    const dbUser = await db('t_users').where('f_work_no', user.workNo).first();
    const checkin = await db('t_checkins')
      .where('f_user_id', dbUser.f_id)
      .where('f_date', today)
      .first();
      
    return c.json({
      success: true,
      data: {
        hasCheckedIn: !!checkin,
        checkinInfo: checkin
      }
    });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 执行打卡
checkinRouter.post('/', async (c) => {
  const { db, user } = c.env;
  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  
  try {
    const dbUser = await db('t_users').where('f_work_no', user.workNo).first();
    
    // 检查是否已打卡
    const existing = await db('t_checkins')
      .where('f_user_id', dbUser.f_id)
      .where('f_date', today)
      .first();
    
    if (existing) {
      return c.json({ success: false, error: '今日已打卡，请勿重复操作' });
    }

    // 计算连续天数
    let continuous = 1;
    if (dbUser.f_last_checkin_date === yesterday) {
      continuous = (dbUser.f_continuous_days || 0) + 1;
    }

    // 插入打卡记录
    await db('t_checkins').insert({
      f_user_id: dbUser.f_id,
      f_date: today
    });

    // 更新用户表
    await db('t_users')
      .where('f_id', dbUser.f_id)
      .update({
        f_continuous_days: continuous,
        f_total_days: (dbUser.f_total_days || 0) + 1,
        f_last_checkin_date: today
      });

    return c.json({
      success: true,
      data: {
        continuousDays: continuous,
        totalDays: dbUser.f_total_days + 1
      }
    });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 获取排行榜
checkinRouter.get('/leaderboard', async (c) => {
  const { db } = c.env;
  try {
    const topUsers = await db('t_users')
      .select('f_id', 'f_nickname', 'f_avatar', 'f_continuous_days', 'f_total_days')
      .orderBy('f_continuous_days', 'desc')
      .orderBy('f_total_days', 'desc')
      .limit(50);
      
    return c.json({ success: true, data: topUsers });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 获取打卡历史（用于日历热力图）
checkinRouter.get('/history', async (c) => {
  const { db, user } = c.env;
  try {
    const dbUser = await db('t_users').where('f_work_no', user.workNo).first();
    const history = await db('t_checkins')
      .where('f_user_id', dbUser.f_id)
      .select('f_date')
      .orderBy('f_date', 'asc');
      
    return c.json({ success: true, data: history.map(h => h.f_date) });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default checkinRouter;