import React, { useEffect, useState } from 'react';
import vibeSdk from "@alipay/weavefox-vibe-web";
import { UserPlus, Search, Trash2, Key, Users as UsersIcon, ShieldCheck } from 'lucide-react';
import { Dialog } from 'radix-ui';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', nickname: '', password: '', role: 'user' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await vibeSdk.functions.get('user/list');
      if (res.success) setUsers(res.data);
    } catch (err) {
      toast.error('加载用户失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    document.title = "用户管理";
  }, []);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.nickname) return toast.error('请填写必填项');
    try {
      const res = await vibeSdk.functions.post('user/', newUser);
      if (res.success) {
        toast.success('添加成功');
        setIsAddOpen(false);
        setNewUser({ username: '', nickname: '', password: '', role: 'user' });
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUpdateUser = async (id, data) => {
    try {
      const res = await vibeSdk.functions.post(`user/${id}`, data);
      if (res.success) {
        toast.success('更新成功');
        fetchUsers();
      }
    } catch (err) {
      toast.error('更新失败');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除该用户吗？')) return;
    try {
      const res = await vibeSdk.functions.delete(`user/${id}`);
      if (res.success) {
        toast.success('已删除');
        fetchUsers();
      }
    } catch (err) {
      toast.error('删除失败');
    }
  };

  const filteredUsers = users.filter(u => 
    u.f_username.toLowerCase().includes(search.toLowerCase()) || 
    u.f_nickname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-primary" /> 管理中心
        </h1>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <input 
              type="text" 
              placeholder="搜索用户名或昵称..."
              className="pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-dark transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> 添加用户
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-foreground-muted uppercase">用户信息</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground-muted uppercase">权限</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground-muted uppercase">连续打卡</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground-muted uppercase">累计打卡</th>
                <th className="px-6 py-4 text-xs font-bold text-foreground-muted uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.f_id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {user.f_nickname[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{user.f_nickname}</p>
                        <p className="text-xs text-foreground-muted">@{user.f_username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                      user.f_role === 'admin' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                    )}>
                      {user.f_role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{user.f_continuous_days} 天</td>
                  <td className="px-6 py-4 text-sm font-medium">{user.f_total_days} 天</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const newNickname = prompt('输入新的昵称', user.f_nickname);
                          if (newNickname) handleUpdateUser(user.f_id, { nickname: newNickname });
                        }}
                        className="p-2 text-foreground-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.f_id)}
                        className="p-2 text-foreground-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-foreground-muted">未找到匹配的用户</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-modal animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[90%] max-w-md p-8 rounded-3xl shadow-xl z-modal animate-in zoom-in-95 duration-200">
            <Dialog.Title className="text-2xl font-bold mb-6 flex items-center gap-2">
              <UsersIcon className="text-primary" /> 添加新同学
            </Dialog.Title>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground/80 ml-1">用户名 (登录账号)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={newUser.username}
                  onChange={e => setNewUser({...newUser, username: e.target.value})}
                  placeholder="如: jack_rose"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground/80 ml-1">昵称</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={newUser.nickname}
                  onChange={e => setNewUser({...newUser, nickname: e.target.value})}
                  placeholder="显示的称呼"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground/80 ml-1">初始密码</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  placeholder="默认 123456"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-foreground/80 ml-1">角色</label>
                <select 
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Dialog.Close asChild>
                <button className="flex-1 py-3 border border-border rounded-xl font-bold hover:bg-neutral-50 transition-colors">取消</button>
              </Dialog.Close>
              <button 
                onClick={handleAddUser}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark shadow-md transition-all active:scale-95"
              >
                确认添加
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AdminUsers;