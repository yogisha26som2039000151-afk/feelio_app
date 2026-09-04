import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/feelio/screen-container';
import { ThemedText } from '@/components/themed-text';
import { EMOTIONS } from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function MoodHistoryScreen() {
  const theme = useTheme();
  const { data } = useAppDataContext();

  const emotionCounts = data.moods.reduce<Record<string, number>>((acc, m) => {
    acc[m.emotionId] = (acc[m.emotionId] ?? 0) + 1;
    return acc;
  }, {});

  const topEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <ScreenContainer noTabInset>
      {data.moods.length === 0 ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          No mood entries yet. Start with a daily check-in!
        </ThemedText>
      ) : (
        <>
          {topEmotions.length > 0 && (
            <View style={[styles.patterns, { backgroundColor: theme.primaryLight }]}>
              <ThemedText type="smallBold">Mood Patterns</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">Most frequent moods:</ThemedText>
              <View style={styles.patternRow}>
                {topEmotions.map(([id, count]) => {
                  const e = EMOTIONS.find((em) => em.id === id);
                  return (
                    <View key={id} style={styles.patternItem}>
                      <ThemedText style={styles.patternEmoji}>{e?.emoji}</ThemedText>
                      <ThemedText type="small">{e?.label} ({count})</ThemedText>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {data.moods.map((m) => {
            const emotion = EMOTIONS.find((e) => e.id === m.emotionId);
            return (
              <View
                key={m.id}
                style={[styles.entry, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <ThemedText style={styles.emoji}>{emotion?.emoji}</ThemedText>
                <View style={styles.entryContent}>
                  <ThemedText type="smallBold">{emotion?.label}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {new Date(m.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </ThemedText>
                  {m.triggers.length > 0 && (
                    <ThemedText type="small" themeColor="textSecondary">
                      Triggers: {m.triggers.join(', ')}
                    </ThemedText>
                  )}
                  {m.note && (
                    <ThemedText type="small" style={styles.note}>{m.note}</ThemedText>
                  )}
                </View>
              </View>
            );
          })}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: 'center', marginTop: Spacing.six },
  patterns: { padding: Spacing.three, borderRadius: BorderRadius.lg, gap: Spacing.two },
  patternRow: { flexDirection: 'row', gap: Spacing.three },
  patternItem: { alignItems: 'center', gap: 4 },
  patternEmoji: { fontSize: 28, lineHeight: 36 },
  entry: {
    flexDirection: 'row',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  emoji: { fontSize: 36, lineHeight: 44 },
  entryContent: { flex: 1, gap: 4 },
  note: { fontStyle: 'italic', marginTop: 4 },
});
