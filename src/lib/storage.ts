import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_BADGES, DEFAULT_GOALS } from '@/constants/data';
import type { AppData } from '@/types';

const STORAGE_KEY = '@feelio_app_data';

export const defaultAppData: AppData = {
  moods: [],
  journal: [],
  goals: DEFAULT_GOALS,
  badges: DEFAULT_BADGES,
  pulseHistory: [],
  anonymousMode: true,
};

export async function loadAppData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultAppData };
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      ...defaultAppData,
      ...parsed,
      goals: parsed.goals?.length ? parsed.goals : DEFAULT_GOALS,
      badges: parsed.badges?.length ? parsed.badges : DEFAULT_BADGES,
    };
  } catch {
    return { ...defaultAppData };
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
