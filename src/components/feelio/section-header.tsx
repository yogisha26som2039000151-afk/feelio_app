import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, subtitle, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <ThemedText type="smallBold" style={styles.title}>{title}</ThemedText>
        {subtitle && (
          <ThemedText type="small" themeColor="textSecondary">{subtitle}</ThemedText>
        )}
      </View>
      {action && onAction && (
        <ThemedText type="linkPrimary" onPress={onAction}>{action}</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  text: { flex: 1, gap: 2 },
  title: { fontSize: 18 },
});
