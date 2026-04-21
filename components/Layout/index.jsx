import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Trophy, BarChart3, Settings, LogOut, Menu, X, User } from 'lucide-react';
import useUserStore from '@/stores/userStore.js';
import { clsx } from 'clsx';
import { DropdownMenu } from 'radix-ui';

const Layout = () => {
  const { userInfo } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: '今日学习', path: '/', icon: BookOpen },
    { name: '排行榜', path: '/ranking', icon: Trophy },
    { name: '统计', path: '/stats', icon: BarChart3 },
    { name: '个人中心', path: '/profile', icon: User },
  ];

  if (userInfo?.role === 'admin') {
    navItems.push({ name: '管理', path: '/admin', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-sticky bg-white/80 backdrop-blur-md border-b border-border shadow-sm h-14 flex items-center px-4 md:px-8">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline">英语打卡</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-foreground-muted"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={userInfo?.avatarUrl || "https://mdn.alipayobjects.com/fecodex_image/afts/img/l4S4Q5f3Bq0AAAAAQZAAAAgAejH3AQBr/original"}
                className="w-8 h-8 rounded-full border-2 border-primary/20"
                alt="Avatar"
              />
              <span className="text-sm font-medium hidden sm:inline">{userInfo?.nickName}</span>
            </div>
            
            <button 
              className="md:hidden p-2 text-foreground-muted hover:bg-neutral-100 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-popover bg-black/20 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-14 left-0 right-0 bg-white border-b border-border p-4 space-y-2 animate-in slide-in-from-top duration-200"
            onClick={e => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 p-3 rounded-xl text-base font-medium transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-foreground-muted hover:bg-neutral-50"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
        <Outlet />
      </main>

      <footer className="py-8 text-center text-foreground-muted text-xs border-t border-border mt-auto">
        <p>© 2024 英语打卡 · 让学习成为习惯</p>
      </footer>
    </div>
  );
};

export default Layout;