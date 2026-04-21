import { Hono } from 'hono';

const contentRouter = new Hono();

// 获取今日学习内容
contentRouter.get('/today', async (c) => {
  const { db } = c.env;
  const today = new Date().toISOString().split('T')[0];
  
  try {
    let content = await db('t_daily_content')
      .where('f_date', today)
      .first();
      
    // 如果今日没有内容，随机获取一条（生产环境下应有每日定时更新逻辑）
    if (!content) {
      content = await db('t_daily_content')
        .orderByRaw('RAND()')
        .first();
    }
    
    return c.json({ success: true, data: content });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default contentRouter;