import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FeelioButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'crisis';
  disabled?: boolean;
};

export function FeelioButton({ title, onPress, variant = 'primary', disabled }: FeelioButtonProps) {
  const theme = useTheme();

  const bg =
    variant === 'primary'
      ? theme.primary
      : variant === 'secondary'
        ? theme.secondary
        : variant === 'crisis'
          ? theme.crisis
          : 'transparent';

  const textColor = variant === 'outline' ? theme.primary : '#FFFFFF';
  const borderColor = variant === 'outline' ? theme.primary : bg;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, borderColor, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
      ]}>
      <ThemedText style={[styles.text, { color: textColor }]}>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.four,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  text: { fontSize: 16, fontWeight: '600' },
});
