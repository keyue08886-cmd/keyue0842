import { Hono } from 'hono';

const userRouter = new Hono();

// 鉴权中间件
const adminOnly = async (c, next) => {
  const { db, user } = c.env;
  const dbUser = await db('t_users').where('f_work_no', user.workNo).first();
  if (!dbUser || dbUser.f_role !== 'admin') {
    return c.json({ success: false, error: '权限不足' }, 403);
  }
  await next();
};

// 获取所有用户列表
userRouter.get('/list', adminOnly, async (c) => {
  const { db } = c.env;
  try {
    const users = await db('t_users')
      .select('f_id', 'f_username', 'f_nickname', 'f_role', 'f_continuous_days', 'f_total_days', 'f_create_time')
      .orderBy('f_create_time', 'desc');
    return c.json({ success: true, data: users });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 添加用户
userRouter.post('/', adminOnly, async (c) => {
  const { db } = c.env;
  const body = await c.req.json();
  try {
    const [id] = await db('t_users').insert({
      f_username: body.username,
      f_password: body.password || '123456',
      f_nickname: body.nickname,
      f_role: body.role || 'user'
    });
    return c.json({ success: true, data: { id } });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 删除用户
userRouter.delete('/:id', adminOnly, async (c) => {
  const { db } = c.env;
  const id = c.req.param('id');
  try {
    await db('t_users').where('f_id', id).delete();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

// 更新用户
userRouter.post('/:id', adminOnly, async (c) => {
  const { db } = c.env;
  const id = c.req.param('id');
  const body = await c.req.json();
  try {
    const updateData = {};
    if (body.nickname) updateData.f_nickname = body.nickname;
    if (body.role) updateData.f_role = body.role;
    if (body.password) updateData.f_password = body.password;
    
    await db('t_users').where('f_id', id).update(updateData);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default userRouter;