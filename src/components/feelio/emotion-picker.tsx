import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { EMOTIONS } from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EmotionPickerProps = {
  selected?: string;
  onSelect: (emotionId: string) => void;
};

export function EmotionPicker({ selected, onSelect }: EmotionPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.grid}>
      {EMOTIONS.map((emotion) => {
        const isSelected = selected === emotion.id;
        return (
          <Pressable
            key={emotion.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(emotion.id);
            }}
            style={[
              styles.item,
              { backgroundColor: theme.card, borderColor: isSelected ? theme.primary : theme.border },
              isSelected && { backgroundColor: theme.primaryLight },
            ]}>
            <Text style={styles.emoji}>{emotion.emoji}</Text>
            <ThemedText type="small" style={styles.label}>{emotion.label}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  item: {
    width: '30%',
    minWidth: 96,
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    overflow: 'visible',
    gap: Spacing.one,
  },
  emoji: { fontSize: 32, lineHeight: 40, textAlign: 'center' },
  label: { fontSize: 12, textAlign: 'center' },
});
