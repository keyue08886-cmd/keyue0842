import React, { useEffect } from 'react';
import useCheckinStore from '@/stores/checkinStore.js';
import useUserStore from '@/stores/userStore.js';
import { Crown, Trophy, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Ranking = () => {
  const { leaderboard, fetchLeaderboard } = useCheckinStore();
  const { userInfo } = useUserStore();

  useEffect(() => {
    fetchLeaderboard();
    document.title = "排行榜";
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  // 渲染前三名
  const TopThreeCard = ({ user, rank }) => {
    // 防御性检查：如果没有用户数据，则不渲染
    if (!user) return null;

    const isFirst = rank === 0;
    const colors = [
      { border: 'border-accent', bg: 'bg-accent/10', icon: 'text-accent', label: '冠军' },
      { border: 'border-neutral-300', bg: 'bg-neutral-100', icon: 'text-neutral-400', label: '亚军' },
      { border: 'border-orange-300', bg: 'bg-orange-50', icon: 'text-orange-400', label: '季军' }
    ];
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.1 }}
        className={clsx(
          "flex flex-col items-center p-6 rounded-3xl border-2 shadow-sm transition-all hover:shadow-md",
          colors[rank]?.border || "border-border",
          colors[rank]?.bg || "bg-white",
          isFirst ? "scale-110 z-10 -mt-4 bg-white" : "scale-100"
        )}
      >
        <div className="relative">
          <img 
            src={user.f_avatar || "https://mdn.alipayobjects.com/fecodex_image/afts/img/l4S4Q5f3Bq0AAAAAQZAAAAgAejH3AQBr/original"} 
            className={clsx("rounded-full border-4 shadow-sm object-cover", isFirst ? "w-24 h-24 border-accent" : "w-16 h-16 border-white")}
            alt={user.f_nickname}
          />
          {isFirst && <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 text-accent" />}
        </div>
        <h3 className="mt-4 font-bold text-lg">{user.f_nickname}</h3>
        <p className="text-sm text-foreground-muted">{colors[rank]?.label}</p>
        <div className="mt-4 flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          <span className="text-primary">{user.f_continuous_days || 0}</span>
          <span className="text-xs text-foreground-muted">天连续</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Trophy className="text-accent" /> 学习英雄榜
        </h1>
        <p className="text-foreground-muted mt-2">看到大家的坚持，你是不是也更有动力了？</p>
      </div>

      {/* Top 3 */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-8">
          <div className="order-2 md:order-1">
            <TopThreeCard user={topThree[1]} rank={1} />
          </div>
          <div className="order-1 md:order-2">
            <TopThreeCard user={topThree[0]} rank={0} />
          </div>
          <div className="order-3 md:order-3">
            <TopThreeCard user={topThree[2]} rank={2} />
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-3xl shadow-card border border-border overflow-hidden">
        <div className="p-6 border-b border-border bg-neutral-50/50">
          <h2 className="font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> 打卡达人
          </h2>
        </div>
        <div className="divide-y divide-border">
          {others.map((user, idx) => (
            <div 
              key={user.f_id} 
              className={clsx(
                "flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors",
                user.f_id === userInfo?.dbId && "bg-primary/5"
              )}
            >
              <span className="w-8 text-center font-mono font-bold text-foreground-muted">{idx + 4}</span>
              <img 
                src={user.f_avatar || "https://mdn.alipayobjects.com/fecodex_image/afts/img/l4S4Q5f3Bq0AAAAAQZAAAAgAejH3AQBr/original"} 
                className="w-10 h-10 rounded-full border border-border object-cover"
                alt={user.f_nickname}
              />
              <div className="flex-1">
                <p className="font-bold">{user.f_nickname}</p>
                <p className="text-xs text-foreground-muted">累计打卡 {user.f_total_days || 0} 天</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{user.f_continuous_days || 0} 天</p>
                <p className="text-[10px] text-foreground-muted uppercase tracking-wider">Continuous</p>
              </div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div className="p-12 text-center text-foreground-muted">暂无排名数据</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ranking;