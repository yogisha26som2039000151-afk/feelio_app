import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FeatureCardProps = {
  title: string;
  description?: string;
  emoji?: string;
  color?: string;
  onPress?: () => void;
  compact?: boolean;
};

export function FeatureCard({ title, description, emoji, color, onPress, compact }: FeatureCardProps) {
  const theme = useTheme();
  const accentColor = color ?? theme.primary;

  return (
    <Pressable
      onPress={() => {
        if (onPress) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }
      }}
      style={({ pressed }) => [styles.card, { backgroundColor: theme.card, borderColor: theme.border }, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, { backgroundColor: accentColor + '22' }]}>
        <ThemedText style={styles.emoji}>{emoji ?? '✨'}</ThemedText>
      </View>
      <View style={styles.textWrap}>
        <ThemedText type="smallBold" style={compact ? styles.compactTitle : undefined}>{title}</ThemedText>
        {description && (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={compact ? 1 : 2}>
            {description}
          </ThemedText>
        )}
      </View>
      {onPress && <ThemedText themeColor="textSecondary">›</ThemedText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24, lineHeight: 32 },
  textWrap: { flex: 1, gap: 2 },
  compactTitle: { fontSize: 15 },
});
