import React from 'react';
import useUserStore from '@/stores/userStore.js';
import { User, Mail, Shield, Award } from 'lucide-react';

const Profile = () => {
  const { userInfo } = useUserStore();

  React.useEffect(() => {
    document.title = "个人中心";
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold">个人中心</h1>
      
      <div className="bg-white rounded-3xl shadow-card border border-border overflow-hidden">
        <div className="h-32 bg-primary/10 relative">
           <div className="absolute -bottom-12 left-8">
              <img 
                src={userInfo?.avatarUrl || "https://mdn.alipayobjects.com/fecodex_image/afts/img/l4S4Q5f3Bq0AAAAAQZAAAAgAejH3AQBr/original"} 
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                alt="Avatar"
              />
           </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{userInfo?.nickName}</h2>
              <p className="text-foreground-muted">@{userInfo?.login}</p>
            </div>
            <div className="flex gap-2">
               <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center gap-1">
                 <Shield className="w-3 h-3" /> {userInfo?.role}
               </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground/80">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-foreground-muted">真实姓名</p>
                  <p className="font-medium">{userInfo?.name || '未设置'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-foreground-muted">邮箱地址</p>
                  <p className="font-medium">{userInfo?.email || '未设置'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground/80">
                <Award className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-foreground-muted">最高连续打卡</p>
                  <p className="font-medium">{userInfo?.continuousDays} 天</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary/5 border border-secondary/10 p-6 rounded-2xl">
        <h3 className="font-bold text-secondary flex items-center gap-2 mb-2">
          温馨提示
        </h3>
        <p className="text-sm text-foreground-muted leading-relaxed">
          您的账号已与公司系统关联。为了保持学习记录的连续性，请记得每天登录打卡。持之以恒是学习语言唯一的捷径。
        </p>
      </div>
    </div>
  );
};

export default Profile;