import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { ChipSelector } from '@/components/feelio/chip-selector';
import { EmotionPicker } from '@/components/feelio/emotion-picker';
import { FeelioButton } from '@/components/feelio/feelio-button';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { SectionHeader } from '@/components/feelio/section-header';
import { ThemedText } from '@/components/themed-text';
import { EMOTIONS, MOOD_TRIGGERS } from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function MoodScreen() {
  const theme = useTheme();
  const { data, addMood } = useAppDataContext();
  const [emotion, setEmotion] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const todayEntry = data.moods.find(
    (m) => m.date.split('T')[0] === new Date().toISOString().split('T')[0],
  );

  const toggleTrigger = (t: string) => {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((i) => i !== t) : [...prev, t]));
  };

  const handleSave = async () => {
    if (!emotion) return;
    await addMood({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      emotionId: emotion,
      triggers,
      note: note.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const weekMoods = data.moods.slice(0, 7);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Daily Mood Check-in</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          How are you feeling today?
        </ThemedText>
      </View>

      {todayEntry && !saved && (
        <View style={[styles.todayBanner, { backgroundColor: theme.secondaryLight }]}>
          <ThemedText type="small">
            You already checked in today as {EMOTIONS.find((e) => e.id === todayEntry.emotionId)?.emoji}{' '}
            {EMOTIONS.find((e) => e.id === todayEntry.emotionId)?.label}. You can update below.
          </ThemedText>
        </View>
      )}

      <EmotionPicker
        selected={emotion || todayEntry?.emotionId}
        onSelect={setEmotion}
      />

      <SectionHeader title="What might be affecting your mood?" />
      <ChipSelector options={MOOD_TRIGGERS} selected={triggers} onToggle={toggleTrigger} />

      <SectionHeader title="Add a note (optional)" />
      <TextInput
        style={[styles.noteInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
        placeholder="Write anything on your mind..."
        placeholderTextColor={theme.textSecondary}
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={3}
      />

      <FeelioButton
        title={saved ? 'Saved! ✓' : 'Save Check-in'}
        onPress={handleSave}
        disabled={!emotion && !todayEntry?.emotionId}
      />

      {weekMoods.length > 0 && (
        <>
          <SectionHeader
            title="This Week"
            action="Full history"
            onAction={() => router.push('/mood-history')}
          />
          <View style={[styles.weekChart, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {weekMoods.map((m) => {
              const e = EMOTIONS.find((em) => em.id === m.emotionId);
              return (
                <View key={m.id} style={styles.weekItem}>
                  <ThemedText style={styles.weekEmoji}>{e?.emoji}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.weekDay}>
                    {new Date(m.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </ThemedText>
                </View>
              );
            })}
          </View>

          {(triggers.length > 0 || weekMoods.some((m) => m.triggers.length > 0)) && (
            <View style={[styles.patterns, { backgroundColor: theme.primaryLight }]}>
              <ThemedText type="smallBold">Patterns & Triggers</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Common triggers in your recent check-ins help you understand what affects your mood.
                Keep checking in to see clearer patterns over time.
              </ThemedText>
            </View>
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.one },
  title: { fontSize: 26, fontWeight: '700' },
  todayBanner: { padding: Spacing.two, borderRadius: BorderRadius.md },
  noteInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  weekChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  weekItem: { alignItems: 'center', gap: 4 },
  weekEmoji: { fontSize: 28 },
  weekDay: { fontSize: 11 },
  patterns: { padding: Spacing.three, borderRadius: BorderRadius.lg, gap: Spacing.one },
});
