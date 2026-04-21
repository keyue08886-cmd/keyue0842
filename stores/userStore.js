import vibeSdk from "@alipay/weavefox-vibe-web";
import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  userInfo: null,
  loading: false,
  error: null,

  initUser: async () => {
    set({ loading: true });
    try {
      const res = await vibeSdk.functions.get('auth/me');
      if (res.success) {
        set({ userInfo: res.data, loading: false });
      } else {
        set({ error: res.error, loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateUserInfoLocal: (updates) => {
    set((state) => ({
      userInfo: state.userInfo ? { ...state.userInfo, ...updates } : null
    }));
  }
}));

export default useUserStore;