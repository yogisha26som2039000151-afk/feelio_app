import { useCallback, useEffect, useState } from 'react';

import { defaultAppData, loadAppData, saveAppData } from '@/lib/storage';
import type { AppData, JournalEntry, MoodEntry, PulseEntry } from '@/types';

export function useAppData() {
  const [data, setData] = useState<AppData>(defaultAppData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppData().then((loaded) => {
      setData(loaded);
      setLoading(false);
    });
  }, []);

  const persist = useCallback(async (next: AppData) => {
    setData(next);
    await saveAppData(next);
  }, []);

  const addMood = useCallback(
    async (entry: MoodEntry) => {
      const moods = [entry, ...data.moods];
      const badges = [...data.badges];
      if (!badges.find((b) => b.id === 'first-mood')?.earned) {
        const idx = badges.findIndex((b) => b.id === 'first-mood');
        if (idx >= 0) badges[idx] = { ...badges[idx], earned: true, earnedDate: new Date().toISOString() };
      }
      const recentDates = new Set(moods.slice(0, 7).map((m) => m.date.split('T')[0]));
      if (recentDates.size >= 7) {
        const idx = badges.findIndex((b) => b.id === 'week-streak');
        if (idx >= 0 && !badges[idx].earned) {
          badges[idx] = { ...badges[idx], earned: true, earnedDate: new Date().toISOString() };
        }
      }
      await persist({ ...data, moods, badges });
    },
    [data, persist],
  );

  const addJournal = useCallback(
    async (entry: JournalEntry) => {
      const journal = [entry, ...data.journal];
      const badges = [...data.badges];
      if (journal.length >= 5) {
        const idx = badges.findIndex((b) => b.id === 'journaler');
        if (idx >= 0 && !badges[idx].earned) {
          badges[idx] = { ...badges[idx], earned: true, earnedDate: new Date().toISOString() };
        }
      }
      await persist({ ...data, journal, badges });
    },
    [data, persist],
  );

  const addPulse = useCallback(
    async (entry: PulseEntry) => {
      const pulseHistory = [entry, ...data.pulseHistory.filter((p) => p.date.split('T')[0] !== entry.date.split('T')[0])];
      await persist({ ...data, pulseHistory });
    },
    [data, persist],
  );

  const toggleGoal = useCallback(
    async (goalId: string) => {
      const goals = data.goals.map((g) => {
        if (g.id !== goalId) return g;
        const completedToday = !g.completedToday;
        return {
          ...g,
          completedToday,
          streak: completedToday ? g.streak + 1 : Math.max(0, g.streak - 1),
          totalCompletions: completedToday ? g.totalCompletions + 1 : g.totalCompletions,
        };
      });
      await persist({ ...data, goals });
    },
    [data, persist],
  );

  const earnBadge = useCallback(
    async (badgeId: string) => {
      const badges = data.badges.map((b) =>
        b.id === badgeId && !b.earned ? { ...b, earned: true, earnedDate: new Date().toISOString() } : b,
      );
      await persist({ ...data, badges });
    },
    [data, persist],
  );

  const setTrustedContact = useCallback(
    async (contact: string) => {
      await persist({ ...data, trustedContact: contact });
    },
    [data, persist],
  );

  const setAnonymousMode = useCallback(
    async (anonymous: boolean) => {
      await persist({ ...data, anonymousMode: anonymous });
    },
    [data, persist],
  );

  return {
    data,
    loading,
    addMood,
    addJournal,
    addPulse,
    toggleGoal,
    earnBadge,
    setTrustedContact,
    setAnonymousMode,
  };
}
