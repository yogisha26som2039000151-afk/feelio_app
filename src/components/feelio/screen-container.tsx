import { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenContainerProps = ScrollViewProps & {
  children: ReactNode;
  padded?: boolean;
  noTabInset?: boolean;
};

export function ScreenContainer({
  children,
  padded = true,
  noTabInset = false,
  contentContainerStyle,
  ...rest
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const bottomInset = noTabInset ? insets.bottom : insets.bottom + BottomTabInset + Spacing.three;

  const platformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: bottomInset,
    },
    default: {
      paddingTop: insets.top + Spacing.two,
      paddingBottom: bottomInset,
    },
  });

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.content, platformStyle, padded && styles.padded, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      {...rest}>
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { flexGrow: 1, alignItems: 'center' },
  padded: { paddingHorizontal: Spacing.three },
  inner: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.three },
});
