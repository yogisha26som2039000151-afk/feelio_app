import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Participant } from '@/types';

type ParticipantSwitcherProps = {
  participants: Participant[];
  currentId?: string;
  onSelect: (id: string) => void;
};

export function ParticipantSwitcher({
  participants,
  currentId,
  onSelect,
}: ParticipantSwitcherProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      {participants.map((participant, index) => {
        const selected = participant.id === currentId;
        return (
          <Pressable
            key={participant.id}
            onPress={() => onSelect(participant.id)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? theme.primaryLight : theme.backgroundElement,
                borderColor: selected ? theme.primary : theme.border,
              },
            ]}>
            <ThemedText type="small" style={{ color: selected ? theme.primary : theme.text }}>
              {participant.label || `P${index + 1}`}
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
