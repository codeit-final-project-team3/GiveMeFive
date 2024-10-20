import { Activity, getActivities, GetActivitiesProps, GetActivitiesResponse } from '@/fetches/activities';
import { create } from 'zustand';

interface ActivityState {
  activitiesResponse: GetActivitiesResponse;
  bestActivitiesResponse: GetActivitiesResponse;
  firstBestActivity: Activity | null;

  getActivities: (param: GetActivitiesProps) => Promise<void>;
  getBestActivities: (page: number) => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activitiesResponse: {
    totalCount: 0,
    activities: [],
  },

  bestActivitiesResponse: {
    cursorId: null,
    totalCount: 0,
    activities: [],
  },

  firstBestActivity: null,

  getActivities: async (param: GetActivitiesProps) => {
    const response: GetActivitiesResponse = await getActivities(param);
    set({ activitiesResponse: response });
  },

  getBestActivities: async (page: number) => {
    const response: GetActivitiesResponse = await getActivities({
      sort: 'most_reviewed',
      method: 'offset',
      page,
      size: 3,
    });
    set({ bestActivitiesResponse: response });
    if (!get().firstBestActivity) {
      set({ firstBestActivity: response.activities[0] });
    }
  },
}));
