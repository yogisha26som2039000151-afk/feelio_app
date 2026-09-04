import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/feelio/screen-container';
import { ThemedText } from '@/components/themed-text';
import { LEARN_TOPICS } from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function LearnTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { earnBadge } = useAppDataContext();
  const topic = LEARN_TOPICS.find((t) => t.id === id);

  useEffect(() => {
    earnBadge('learner');
  }, [earnBadge]);

  if (!topic) {
    return (
      <ScreenContainer noTabInset>
        <ThemedText>Topic not found</ThemedText>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noTabInset>
      <View style={[styles.hero, { backgroundColor: topic.color + '33' }]}>
        <ThemedText style={styles.emoji}>{topic.emoji}</ThemedText>
        <ThemedText type="smallBold" style={styles.title}>{topic.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">{topic.summary}</ThemedText>
      </View>

      {topic.content.map((paragraph, i) => (
        <View
          key={i}
          style={[styles.paragraph, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText type="small" style={styles.paragraphText}>{paragraph}</ThemedText>
        </View>
      ))}

      <View style={[styles.tip, { backgroundColor: theme.secondaryLight }]}>
        <ThemedText type="smallBold">💡 Remember</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Learning about mental health is a sign of self-awareness. If you're struggling, don't hesitate to reach out for support.
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', padding: Spacing.four, borderRadius: BorderRadius.xl, gap: Spacing.two },
  emoji: { fontSize: 48 },
  title: { fontSize: 24 },
  paragraph: { padding: Spacing.three, borderRadius: BorderRadius.lg, borderWidth: 1 },
  paragraphText: { lineHeight: 22 },
  tip: { padding: Spacing.three, borderRadius: BorderRadius.lg, gap: Spacing.one },
});
