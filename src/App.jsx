import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useUserStore from '@/stores/userStore.js';

// 使用 lazy 动态导入页面组件
const Dashboard = lazy(() => import('@/pages/Dashboard/index.jsx'));
const Ranking = lazy(() => import('@/pages/Ranking/index.jsx'));
const Stats = lazy(() => import('@/pages/Stats/index.jsx'));
const AdminUsers = lazy(() => import('@/pages/Admin/Users.jsx'));
const Profile = lazy(() => import('@/pages/Profile/index.jsx'));
const Layout = lazy(() => import('@/components/Layout/index.jsx'));

// 加载中组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  const { initUser, userInfo, loading } = useUserStore();

  useEffect(() => {
    initUser();
  }, [initUser]);

  if (loading && !userInfo) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<Profile />} />
          {userInfo?.role === 'admin' && (
            <Route path="admin" element={<AdminUsers />} />
          )}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;