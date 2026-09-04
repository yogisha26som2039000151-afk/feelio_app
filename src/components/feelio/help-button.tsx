import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function HelpButton() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        router.push('/help');
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.crisis,
          bottom: insets.bottom + BottomTabInset + Spacing.two,
        },
        pressed && styles.pressed,
      ]}>
      <ThemedText style={styles.emoji}>🚨</ThemedText>
      <ThemedText style={styles.label}>Help</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.96 }] },
  emoji: { fontSize: 16, color: '#fff' },
  label: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
