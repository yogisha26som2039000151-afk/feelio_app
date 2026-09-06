import { useCallback, useEffect, useState } from 'react';

import {
  createDefaultAppData,
  loadAllSurveyExports,
  loadAppData,
  loadSurveyMeta,
  MAX_PARTICIPANTS,
  resetAppData,
  saveAppData,
  saveSurveyMeta,
  wipeAllFeelioStorage,
} from '@/lib/storage';
import type { AppData, JournalEntry, MoodEntry, Participant, PulseEntry } from '@/types';

export function useAppData() {
  const [data, setData] = useState<AppData>(createDefaultAppData());
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentParticipantId, setCurrentParticipantId] = useState('p1');
  const [dataRevision, setDataRevision] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const meta = await loadSurveyMeta();
      const loaded = await loadAppData(meta.currentParticipantId);
      setParticipants(meta.participants);
      setCurrentParticipantId(meta.currentParticipantId);
      setData(loaded);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(
    async (next: AppData, participantId = currentParticipantId) => {
      setData(next);
      await saveAppData(participantId, next);
    },
    [currentParticipantId],
  );

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

  const switchParticipant = useCallback(
    async (participantId: string) => {
      if (participantId === currentParticipantId) return;
      await saveAppData(currentParticipantId, data);
      const nextData = await loadAppData(participantId);
      const nextMeta = {
        currentParticipantId: participantId,
        participants,
      };
      await saveSurveyMeta(nextMeta);
      setCurrentParticipantId(participantId);
      setData(nextData);
    },
    [currentParticipantId, data, participants],
  );

  const addParticipant = useCallback(
    async (label: string) => {
      if (participants.length >= MAX_PARTICIPANTS) return false;
      const trimmed = label.trim() || `Participant ${participants.length + 1}`;
      const participant: Participant = {
        id: `p${Date.now()}`,
        label: trimmed,
        createdAt: new Date().toISOString(),
      };
      const nextParticipants = [...participants, participant];
      const nextData = createDefaultAppData();
      await saveAppData(currentParticipantId, data);
      await saveAppData(participant.id, nextData);
      await saveSurveyMeta({ currentParticipantId: participant.id, participants: nextParticipants });
      setParticipants(nextParticipants);
      setCurrentParticipantId(participant.id);
      setData(nextData);
      return true;
    },
    [currentParticipantId, data, participants],
  );

  const resetCurrentParticipant = useCallback(async () => {
    const fresh = await resetAppData(currentParticipantId);
    setData(fresh);
    setDataRevision((n) => n + 1);
  }, [currentParticipantId]);

  const clearAllParticipants = useCallback(async () => {
    const meta = await wipeAllFeelioStorage();
    setParticipants(meta.participants);
    setCurrentParticipantId(meta.currentParticipantId);
    setData(createDefaultAppData());
    setDataRevision((n) => n + 1);
  }, []);

  const exportAllSurveyData = useCallback(async () => {
    await saveAppData(currentParticipantId, data);
    const rows = await loadAllSurveyExports();
    return {
      exportedAt: new Date().toISOString(),
      participants: rows.map(({ participant, data: appData }) => ({
        id: participant.id,
        label: participant.label,
        createdAt: participant.createdAt,
        moods: appData.moods,
        journal: appData.journal,
        pulseHistory: appData.pulseHistory,
        goals: appData.goals,
        badges: appData.badges,
        anonymousMode: appData.anonymousMode,
      })),
    };
  }, [currentParticipantId, data]);

  const currentParticipant = participants.find((p) => p.id === currentParticipantId) ?? null;

  return {
    data,
    loading,
    participants,
    currentParticipant,
    dataRevision,
    maxParticipants: MAX_PARTICIPANTS,
    addMood,
    addJournal,
    addPulse,
    toggleGoal,
    earnBadge,
    setTrustedContact,
    setAnonymousMode,
    switchParticipant,
    addParticipant,
    resetCurrentParticipant,
    clearAllParticipants,
    exportAllSurveyData,
  };
}
