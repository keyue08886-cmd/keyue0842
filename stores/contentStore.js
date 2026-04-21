import vibeSdk from "@alipay/weavefox-vibe-web";
import { create } from 'zustand';

const useContentStore = create((set) => ({
  todayContent: null,
  loading: false,

  fetchTodayContent: async () => {
    set({ loading: true });
    try {
      const res = await vibeSdk.functions.get('content/today');
      if (res.success) {
        set({ todayContent: res.data, loading: false });
      }
    } catch (err) {
      set({ loading: false });
      console.error(err);
    }
  }
}));

export default useContentStore;