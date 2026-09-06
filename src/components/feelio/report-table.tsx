import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ReportTableViewProps = {
  title: string;
  columns: string[];
  rows: string[][];
};

export function ReportTableView({ title, columns, rows }: ReportTableViewProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <ThemedText type="smallBold">{title}</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          <View style={[styles.row, { backgroundColor: theme.primaryLight }]}>
            {columns.map((column, index) => (
              <ThemedText
                key={column}
                type="smallBold"
                style={[styles.cell, index === columns.length - 1 && styles.wideCell]}>
                {column}
              </ThemedText>
            ))}
          </View>
          {rows.length === 0 ? (
            <View style={[styles.row, { borderColor: theme.border, backgroundColor: theme.card }]}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
                No data yet
              </ThemedText>
            </View>
          ) : (
            rows.map((row, index) => (
              <View
                key={`${title}-${index}`}
                style={[
                  styles.row,
                  {
                    borderColor: theme.border,
                    backgroundColor: index % 2 === 0 ? theme.card : theme.backgroundElement,
                  },
                ]}>
                {row.map((cell, cellIndex) => (
                  <ThemedText
                    key={`${index}-${cellIndex}`}
                    type="small"
                    style={[styles.cell, cellIndex === row.length - 1 && styles.wideCell]}>
                    {cell}
                  </ThemedText>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  cell: {
    width: 150,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  wideCell: {
    width: 260,
  },
  empty: {
    padding: Spacing.two,
    width: 320,
  },
});
