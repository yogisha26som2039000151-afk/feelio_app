import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { FeatureCard } from '@/components/feelio/feature-card';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { ThemedText } from '@/components/themed-text';
import { LEARN_TOPICS } from '@/constants/data';
import { Spacing } from '@/constants/theme';

export default function LearnScreen() {
  return (
    <ScreenContainer noTabInset>
      <ThemedText type="small" themeColor="textSecondary" style={styles.intro}>
        Short, easy-to-understand content about mental health topics that matter to you.
      </ThemedText>
      <View style={styles.list}>
        {LEARN_TOPICS.map((topic) => (
          <FeatureCard
            key={topic.id}
            title={topic.title}
            description={topic.summary}
            emoji={topic.emoji}
            color={topic.color}
            onPress={() => router.push({ pathname: '/learn-topic', params: { id: topic.id } })}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  intro: { marginBottom: Spacing.two },
  list: { gap: Spacing.two },
});
