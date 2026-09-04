import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipSelectorProps = {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  multi?: boolean;
};

export function ChipSelector({ options, selected, onToggle, multi = true }: ChipSelectorProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Pressable
            key={option}
            onPress={() => {
              Haptics.selectionAsync();
              if (!multi) {
                onToggle(option);
                return;
              }
              onToggle(option);
            }}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? theme.primaryLight : theme.backgroundElement,
                borderColor: isSelected ? theme.primary : theme.border,
              },
            ]}>
            <ThemedText
              type="small"
              style={{ color: isSelected ? theme.primary : theme.text }}>
              {option}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one + 2,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
});
