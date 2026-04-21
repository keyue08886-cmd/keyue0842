import vibeSdk from "@alipay/weavefox-vibe-web";
import { create } from 'zustand';

const useCheckinStore = create((set, get) => ({
  todayStatus: null,
  leaderboard: [],
  history: [],
  loading: false,

  fetchTodayStatus: async () => {
    try {
      const res = await vibeSdk.functions.get('checkin/today-status');
      if (res.success) {
        set({ todayStatus: res.data });
      }
    } catch (err) {
      console.error(err);
    }
  },

  performCheckin: async () => {
    set({ loading: true });
    try {
      const res = await vibeSdk.functions.post('checkin/');
      if (res.success) {
        set({ 
          todayStatus: { hasCheckedIn: true, checkinInfo: res.data },
          loading: false 
        });
        return res;
      }
      throw new Error(res.error);
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  fetchLeaderboard: async () => {
    try {
      const res = await vibeSdk.functions.get('checkin/leaderboard');
      if (res.success) {
        set({ leaderboard: res.data });
      }
    } catch (err) {
      console.error(err);
    }
  },

  fetchHistory: async () => {
    try {
      const res = await vibeSdk.functions.get('checkin/history');
      if (res.success) {
        set({ history: res.data });
      }
    } catch (err) {
      console.error(err);
    }
  }
}));

export default useCheckinStore;