import { View, StyleSheet } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { HelpButton } from '@/components/feelio/help-button';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <AppTabs />
      <HelpButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
