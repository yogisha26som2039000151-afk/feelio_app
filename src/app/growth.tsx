import { Pressable, StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/feelio/screen-container';
import { SectionHeader } from '@/components/feelio/section-header';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function GrowthScreen() {
  const theme = useTheme();
  const { data, toggleGoal } = useAppDataContext();

  return (
    <ScreenContainer noTabInset>
      <SectionHeader title="Daily Wellness Goals" subtitle="Tap to mark complete" />
      <View style={styles.goals}>
        {data.goals.map((goal) => (
          <Pressable
            key={goal.id}
            onPress={() => toggleGoal(goal.id)}
            style={[
              styles.goalCard,
              {
                backgroundColor: goal.completedToday ? theme.secondaryLight : theme.card,
                borderColor: goal.completedToday ? theme.secondary : theme.border,
              },
            ]}>
            <ThemedText style={styles.goalEmoji}>{goal.emoji}</ThemedText>
            <View style={styles.goalInfo}>
              <ThemedText
                type="smallBold"
                style={goal.completedToday ? { textDecorationLine: 'line-through' } : undefined}>
                {goal.title}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                🔥 {goal.streak} day streak · {goal.totalCompletions} total
              </ThemedText>
            </View>
            <ThemedText style={styles.check}>{goal.completedToday ? '✅' : '○'}</ThemedText>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Achievements & Badges" />
      <View style={styles.badges}>
        {data.badges.map((badge) => (
          <View
            key={badge.id}
            style={[
              styles.badge,
              {
                backgroundColor: badge.earned ? theme.primaryLight : theme.backgroundElement,
                borderColor: badge.earned ? theme.primary : theme.border,
                opacity: badge.earned ? 1 : 0.6,
              },
            ]}>
            <ThemedText style={styles.badgeEmoji}>{badge.emoji}</ThemedText>
            <ThemedText type="smallBold" style={styles.badgeTitle}>{badge.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.badgeDesc}>
              {badge.description}
            </ThemedText>
            {badge.earned && badge.earnedDate && (
              <ThemedText type="small" style={{ color: theme.primary, fontSize: 11 }}>
                Earned {new Date(badge.earnedDate).toLocaleDateString()}
              </ThemedText>
            )}
          </View>
        ))}
      </View>

      <View style={[styles.challenge, { backgroundColor: theme.accentLight }]}>
        <ThemedText type="smallBold">🌟 Self-Care Challenge</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Complete all daily goals for 3 days in a row to unlock the "Wellness Warrior" badge!
        </ThemedText>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  goals: { gap: Spacing.two },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: Spacing.two,
  },
  goalEmoji: { fontSize: 28, lineHeight: 36 },
  goalInfo: { flex: 1, gap: 2 },
  check: { fontSize: 22, lineHeight: 28 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  badge: {
    width: '47%',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  badgeEmoji: { fontSize: 32, lineHeight: 40 },
  badgeTitle: { fontSize: 13, textAlign: 'center' },
  badgeDesc: { fontSize: 11, textAlign: 'center' },
  challenge: { padding: Spacing.three, borderRadius: BorderRadius.lg, gap: Spacing.one },
});
