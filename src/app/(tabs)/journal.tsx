import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { FeatureCard } from '@/components/feelio/feature-card';
import { FeelioButton } from '@/components/feelio/feelio-button';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { SectionHeader } from '@/components/feelio/section-header';
import { ThemedText } from '@/components/themed-text';
import { JOURNAL_PROMPTS } from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function JournalScreen() {
  const theme = useTheme();
  const { data } = useAppDataContext();

  const startEntry = (prompt: string) => {
    router.push({ pathname: '/journal-entry', params: { prompt } });
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Feelio Journal</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Your private space to reflect and express
        </ThemedText>
      </View>

      <View style={[styles.privacyNote, { backgroundColor: theme.secondaryLight }]}>
        <ThemedText type="small">🔒 All entries are stored privately on your device</ThemedText>
      </View>

      <SectionHeader title="Guided Prompts" subtitle="Tap a prompt to start writing" />
      <View style={styles.prompts}>
        {JOURNAL_PROMPTS.map((prompt) => (
          <Pressable
            key={prompt}
            onPress={() => startEntry(prompt)}
            style={[styles.promptCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText type="smallBold">{prompt}</ThemedText>
            <ThemedText themeColor="textSecondary">›</ThemedText>
          </Pressable>
        ))}
      </View>

      <FeelioButton title="Free Write" variant="outline" onPress={() => startEntry('Free write')} />

      {data.journal.length > 0 && (
        <>
          <SectionHeader title="Recent Entries" />
          {data.journal.slice(0, 5).map((entry) => (
            <View
              key={entry.id}
              style={[styles.entryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.entryHeader}>
                <ThemedText type="smallBold" numberOfLines={1}>{entry.prompt}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {new Date(entry.date).toLocaleDateString()}
                </ThemedText>
              </View>
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={3}>
                {entry.content}
              </ThemedText>
              {entry.hasVoiceNote && (
                <ThemedText type="small" style={{ color: theme.primary }}>🎙️ Voice note attached</ThemedText>
              )}
            </View>
          ))}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.one },
  title: { fontSize: 26, fontWeight: '700' },
  privacyNote: { padding: Spacing.two, borderRadius: BorderRadius.md },
  prompts: { gap: Spacing.two },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  entryCard: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.one,
  },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
