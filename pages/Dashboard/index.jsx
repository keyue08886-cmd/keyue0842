import React, { useEffect, useState } from 'react';
import useContentStore from '@/stores/contentStore.js';
import useCheckinStore from '@/stores/checkinStore.js';
import useUserStore from '@/stores/userStore.js';
import { Calendar, Flame, Volume2, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';

const Dashboard = () => {
  const { userInfo, updateUserInfoLocal } = useUserStore();
  const { todayContent, fetchTodayContent } = useContentStore();
  const { todayStatus, fetchTodayStatus, performCheckin, loading } = useCheckinStore();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchTodayContent();
    fetchTodayStatus();
    document.title = "今日学习";
  }, []);

  const handleCheckin = async () => {
    if (todayStatus?.hasCheckedIn) return;
    setChecking(true);
    try {
      const res = await performCheckin();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7CB9A8', '#F4A698', '#D4A574']
      });
      toast.success('打卡成功！又进步了一点点');
      // 更新本地状态
      updateUserInfoLocal({
        continuousDays: res.data.continuousDays,
        totalDays: res.data.totalDays
      });
    } catch (err) {
      toast.error(err.message || '打卡失败');
    } finally {
      setChecking(false);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "早上好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {greeting()}，{userInfo?.nickName}
          </h1>
          <p className="text-foreground-muted mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>
        <div className="flex items-center bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
          <Flame className="w-5 h-5 text-secondary mr-2" />
          <span className="text-lg font-bold text-primary">连续打卡 {userInfo?.continuousDays || 0} 天</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Word Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-8 rounded-2xl shadow-card border border-border relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="relative">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">今日单词</span>
            <div className="mt-6 flex items-baseline gap-3">
              <h2 className="text-4xl font-bold text-foreground tracking-tight">{todayContent?.f_word}</h2>
              <span className="text-foreground-muted font-mono">{todayContent?.f_word_phonetic}</span>
              <button 
                onClick={() => speak(todayContent?.f_word)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <Volume2 className="w-5 h-5 text-primary" />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xl font-medium text-foreground">{todayContent?.f_word_meaning}</p>
            </div>
            <div className="mt-8 pt-8 border-t border-dashed border-border">
              <p className="text-foreground font-medium italic">"{todayContent?.f_word_example}"</p>
            </div>
          </div>
        </motion.div>

        {/* Sentence Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-8 rounded-2xl shadow-card border border-border relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="relative">
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">每日一句</span>
            <div className="mt-6">
              <p className="text-2xl font-bold text-foreground leading-relaxed italic">
                {todayContent?.f_sentence_en}
              </p>
              <button 
                onClick={() => speak(todayContent?.f_sentence_en)}
                className="mt-2 flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <Volume2 className="w-4 h-4" /> 听音频
              </button>
            </div>
            <div className="mt-6">
              <p className="text-lg text-foreground-muted">{todayContent?.f_sentence_cn}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Checkin Action */}
      <div className="flex justify-center pt-8 pb-12">
        <button
          disabled={todayStatus?.hasCheckedIn || checking || loading}
          onClick={handleCheckin}
          className={clsx(
            "group relative px-12 py-5 rounded-full text-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-3",
            todayStatus?.hasCheckedIn 
              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed" 
              : "bg-primary text-white hover:bg-primary-dark hover:shadow-xl hover:-translate-y-1"
          )}
        >
          {todayStatus?.hasCheckedIn ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-primary" />
              今日已打卡
            </>
          ) : (
            <>
              {checking ? "打卡中..." : "完成学习，去打卡"}
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;