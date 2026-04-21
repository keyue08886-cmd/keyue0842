import { Hono } from 'hono';

const authRouter = new Hono();

// 获取当前登录用户信息（基于 env.user 和 数据库匹配）
authRouter.get('/me', async (c) => {
  const { db, user } = c.env;
  
  try {
    // 优先通过工号查找数据库中的用户
    let dbUser = await db('t_users').where('f_work_no', user.workNo).first();
    
    // 如果数据库中没有该工号（新登录的用户），自动创建一个
    if (!dbUser) {
      const [newId] = await db('t_users').insert({
        f_work_no: user.workNo,
        f_username: user.login,
        f_password: 'nopassword', // SSO 登录不需要密码
        f_nickname: user.nickName || user.name,
        f_avatar: user.avatarUrl,
        f_role: 'user'
      });
      dbUser = await db('t_users').where('f_id', newId).first();
    }

    return c.json({
      success: true,
      data: {
        ...user,
        role: dbUser.f_role,
        dbId: dbUser.f_id,
        continuousDays: dbUser.f_continuous_days,
        totalDays: dbUser.f_total_days,
        lastCheckinDate: dbUser.f_last_checkin_date
      }
    });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default authRouter;