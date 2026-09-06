import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { FeatureCard } from '@/components/feelio/feature-card';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { SectionHeader } from '@/components/feelio/section-header';
import { ThemedText } from '@/components/themed-text';
import { LEARN_TOPICS, RELIEF_ACTIVITIES } from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function WellnessScreen() {
  const theme = useTheme();
  const { data } = useAppDataContext();
  const earnedBadges = data.badges.filter((b) => b.earned).length;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Wellness Hub</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Tools for relief, learning, and personal growth
        </ThemedText>
      </View>

      <SectionHeader title="Quick Relief" subtitle="Short activities when you feel overwhelmed" />
      <View style={styles.grid}>
        {RELIEF_ACTIVITIES.slice(0, 4).map((activity) => (
          <FeatureCard
            key={activity.id}
            title={activity.title}
            description={activity.duration}
            emoji={activity.emoji}
            onPress={() => router.push({ pathname: '/relief-activity', params: { id: activity.id } })}
            compact
          />
        ))}
      </View>
      <FeatureCard
        title="See all relief activities"
        emoji="🧘"
        color={theme.secondary}
        onPress={() => router.push('/relief')}
      />

      <SectionHeader title="Learn" subtitle="Easy-to-understand mental health content" />
      <View style={styles.topicRow}>
        {LEARN_TOPICS.slice(0, 4).map((topic) => (
          <View
            key={topic.id}
            style={[styles.topicChip, { backgroundColor: topic.color + '33' }]}>
            <ThemedText style={styles.topicEmoji}>{topic.emoji}</ThemedText>
            <ThemedText type="small" style={styles.topicLabel}>{topic.title}</ThemedText>
          </View>
        ))}
      </View>
      <FeatureCard
        title="Browse all topics"
        description={`${LEARN_TOPICS.length} articles available`}
        emoji="🧠"
        color={theme.primary}
        onPress={() => router.push('/learn')}
      />

      <SectionHeader title="Personal Growth" />
      <View style={[styles.growthPreview, { backgroundColor: theme.accentLight, borderColor: theme.accent }]}>
        <View style={styles.growthStats}>
          <View style={styles.stat}>
            <ThemedText style={styles.statNum}>{data.goals.filter((g) => g.completedToday).length}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Goals today</ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statNum}>{earnedBadges}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Badges earned</ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statNum}>
              {Math.max(...data.goals.map((g) => g.streak), 0)}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Best streak</ThemedText>
          </View>
        </View>
        <FeatureCard
          title="View goals & achievements"
          emoji="🎯"
          color={theme.accent}
          onPress={() => router.push('/growth')}
          compact
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.one },
  title: { fontSize: 26, fontWeight: '700', lineHeight: 34 },
  grid: { gap: Spacing.two },
  topicRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: BorderRadius.full,
  },
  topicEmoji: { fontSize: 16, lineHeight: 22 },
  topicLabel: { fontSize: 13 },
  growthPreview: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  growthStats: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center', gap: 4 },
  statNum: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
});
