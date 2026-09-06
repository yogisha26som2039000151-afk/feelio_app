import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_BADGES, DEFAULT_GOALS } from '@/constants/data';
import type { AppData, Participant, SurveyMeta } from '@/types';

const LEGACY_STORAGE_KEY = '@feelio_app_data';
const META_KEY = '@feelio_survey_meta';
const SCHEMA_KEY = '@feelio_schema';
const SCHEMA_VERSION = '2';

export const MAX_PARTICIPANTS = 10;

export function dataKey(participantId: string) {
  return `@feelio_app_data:${participantId}`;
}

export function createDefaultAppData(): AppData {
  return {
    moods: [],
    journal: [],
    goals: DEFAULT_GOALS.map((g) => ({ ...g })),
    badges: DEFAULT_BADGES.map((b) => ({ ...b })),
    pulseHistory: [],
    anonymousMode: true,
  };
}

export const defaultAppData = createDefaultAppData();

function createInitialMeta(): SurveyMeta {
  const first: Participant = {
    id: 'p1',
    label: 'Participant 1',
    createdAt: new Date().toISOString(),
  };
  return { currentParticipantId: first.id, participants: [first] };
}

function parseAppData(raw: string | null): AppData {
  if (!raw) return createDefaultAppData();
  const parsed = JSON.parse(raw) as Partial<AppData>;
  return {
    ...createDefaultAppData(),
    ...parsed,
    goals: parsed.goals?.length ? parsed.goals : DEFAULT_GOALS.map((g) => ({ ...g })),
    badges: parsed.badges?.length ? parsed.badges : DEFAULT_BADGES.map((b) => ({ ...b })),
  };
}

export async function wipeAllFeelioStorage(): Promise<SurveyMeta> {
  const keys = await AsyncStorage.getAllKeys();
  const feelioKeys = keys.filter((key) => key.startsWith('@feelio'));
  if (feelioKeys.length) {
    await AsyncStorage.multiRemove(feelioKeys);
  }
  const meta = createInitialMeta();
  await saveSurveyMeta(meta);
  await saveAppData(meta.currentParticipantId, createDefaultAppData());
  await AsyncStorage.setItem(SCHEMA_KEY, SCHEMA_VERSION);
  return meta;
}

export async function loadSurveyMeta(): Promise<SurveyMeta> {
  const schema = await AsyncStorage.getItem(SCHEMA_KEY);
  if (schema !== SCHEMA_VERSION) {
    return wipeAllFeelioStorage();
  }

  try {
    const raw = await AsyncStorage.getItem(META_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SurveyMeta;
      if (parsed.participants?.length && parsed.currentParticipantId) return parsed;
    }
  } catch {
    // Fall through to first-run setup.
  }

  const meta = createInitialMeta();
  await saveSurveyMeta(meta);
  return meta;
}

export async function saveSurveyMeta(meta: SurveyMeta): Promise<void> {
  await AsyncStorage.setItem(META_KEY, JSON.stringify(meta));
}

export async function loadAppData(participantId: string): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(dataKey(participantId));
    return parseAppData(raw);
  } catch {
    return createDefaultAppData();
  }
}

export async function saveAppData(participantId: string, data: AppData): Promise<void> {
  await AsyncStorage.setItem(dataKey(participantId), JSON.stringify(data));
}

export async function resetAppData(participantId: string): Promise<AppData> {
  const fresh = createDefaultAppData();
  await saveAppData(participantId, fresh);
  return fresh;
}

export async function resetAllAppData(participantIds: string[]): Promise<void> {
  await Promise.all(participantIds.map((id) => saveAppData(id, createDefaultAppData())));
  await AsyncStorage.removeItem(LEGACY_STORAGE_KEY);
}

export async function loadAllSurveyExports(): Promise<
  { participant: Participant; data: AppData }[]
> {
  const meta = await loadSurveyMeta();
  const rows = await Promise.all(
    meta.participants.map(async (participant) => ({
      participant,
      data: await loadAppData(participant.id),
    })),
  );
  return rows;
}
