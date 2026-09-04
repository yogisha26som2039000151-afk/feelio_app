import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { FeatureCard } from '@/components/feelio/feature-card';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { ThemedText } from '@/components/themed-text';
import { RELIEF_ACTIVITIES } from '@/constants/data';
import { Spacing } from '@/constants/theme';

export default function ReliefScreen() {
  return (
    <ScreenContainer noTabInset>
      <ThemedText type="small" themeColor="textSecondary" style={styles.intro}>
        Short activities for when you feel overwhelmed. Pick one and take a moment for yourself.
      </ThemedText>
      <View style={styles.list}>
        {RELIEF_ACTIVITIES.map((activity) => (
          <FeatureCard
            key={activity.id}
            title={activity.title}
            description={`${activity.duration} · ${activity.description}`}
            emoji={activity.emoji}
            onPress={() => router.push({ pathname: '/relief-activity', params: { id: activity.id } })}
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
