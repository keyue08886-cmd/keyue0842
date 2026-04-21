import React, { useEffect, useMemo } from 'react';
import useCheckinStore from '@/stores/checkinStore.js';
import useUserStore from '@/stores/userStore.js';
import { Calendar as CalendarIcon, TrendingUp, CheckSquare, Target } from 'lucide-react';
import dayjs from 'dayjs';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { clsx } from 'clsx';

const Stats = () => {
  const { history, fetchHistory } = useCheckinStore();
  const { userInfo } = useUserStore();

  useEffect(() => {
    fetchHistory();
    document.title = "学习统计";
  }, []);

  const stats = [
    { label: '累计打卡', value: userInfo?.totalDays || 0, unit: '天', icon: CheckSquare, color: 'text-primary' },
    { label: '当前连续', value: userInfo?.continuousDays || 0, unit: '天', icon: TrendingUp, color: 'text-secondary' },
    { label: '本月打卡', value: useMemo(() => {
      const startOfMonth = dayjs().startOf('month');
      return history.filter(d => dayjs(d).isAfter(startOfMonth) || dayjs(d).isSame(startOfMonth, 'day')).length;
    }, [history]), unit: '天', icon: Target, color: 'text-accent' },
  ];

  // 生成最近 30 天的打卡趋势数据
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      const hasChecked = history.some(h => dayjs(h).format('YYYY-MM-DD') === date);
      data.push({
        name: dayjs(date).format('MM-DD'),
        status: hasChecked ? 1 : 0
      });
    }
    return data;
  }, [history]);

  // 生成简易日历热力图
  const calendarDays = useMemo(() => {
    const days = [];
    const end = dayjs().endOf('week');
    const start = dayjs().subtract(5, 'month').startOf('month').startOf('week');
    
    let current = start;
    while (current.isBefore(end) || current.isSame(end, 'day')) {
      const dateStr = current.format('YYYY-MM-DD');
      days.push({
        date: dateStr,
        checked: history.some(h => dayjs(h).format('YYYY-MM-DD') === dateStr),
        isToday: dateStr === dayjs().format('YYYY-MM-DD')
      });
      current = current.add(1, 'day');
    }
    return days;
  }, [history]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <CalendarIcon className="text-primary" /> 学习统计
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-card border border-border flex items-center gap-5">
            <div className={clsx("p-4 rounded-2xl bg-neutral-50", item.color)}>
              <item.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-foreground-muted font-medium">{item.label}</p>
              <p className="text-3xl font-bold mt-1">
                {item.value} <span className="text-base font-normal text-foreground-muted">{item.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-card border border-border">
          <h2 className="font-bold mb-6 flex items-center gap-2">打卡日历 <span className="text-xs font-normal text-foreground-muted">(最近6个月)</span></h2>
          <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
            {calendarDays.map((day, idx) => (
              <div 
                key={idx}
                title={day.date}
                className={clsx(
                  "w-3 h-3 md:w-4 md:h-4 rounded-[2px] transition-all",
                  day.checked ? "bg-primary" : "bg-neutral-100",
                  day.isToday && "ring-2 ring-secondary ring-offset-1"
                )}
              />
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4 text-xs text-foreground-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-neutral-100 rounded-[2px]" /> 少
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-primary rounded-[2px]" /> 多
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-card border border-border flex flex-col">
          <h2 className="font-bold mb-6">学习热度 <span className="text-xs font-normal text-foreground-muted">(最近30天)</span></h2>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7CB9A8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7CB9A8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 1.2]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="status" 
                  stroke="#7CB9A8" 
                  fillOpacity={1} 
                  fill="url(#colorStatus)" 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-center text-xs text-foreground-muted">保持节奏，每天进步一点点</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;