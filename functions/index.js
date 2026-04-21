import { Hono } from 'hono';
import authRouter from './auth.js';
import checkinRouter from './checkin.js';
import userRouter from './user.js';
import contentRouter from './content.js';

const app = new Hono();

// 子路由
app.route('/auth', authRouter);
app.route('/checkin', checkinRouter);
app.route('/user', userRouter);
app.route('/content', contentRouter);

// 404 处理
app.notFound((c) => {
  return c.json({ success: false, error: '接口未找到' }, 404);
});

export default app;