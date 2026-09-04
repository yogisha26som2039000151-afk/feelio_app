import { Switch, StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/feelio/screen-container';
import { SectionHeader } from '@/components/feelio/section-header';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function PrivacyScreen() {
  const theme = useTheme();
  const { data, setAnonymousMode } = useAppDataContext();

  return (
    <ScreenContainer noTabInset>
      <View style={[styles.hero, { backgroundColor: theme.primaryLight }]}>
        <ThemedText style={styles.emoji}>🔒</ThemedText>
        <ThemedText type="smallBold" style={styles.heroTitle}>Your Privacy Matters</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.heroText}>
          Feelio is designed with your safety and privacy at the center.
        </ThemedText>
      </View>

      <View style={[styles.setting, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.settingText}>
          <ThemedText type="smallBold">Anonymous Mode</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Hide your name in Talk Space and use a generic profile
          </ThemedText>
        </View>
        <Switch
          value={data.anonymousMode}
          onValueChange={setAnonymousMode}
          trackColor={{ false: theme.border, true: theme.primary }}
        />
      </View>

      <SectionHeader title="Privacy Controls" />
      {[
        { title: 'Local Storage Only', desc: 'All journal entries and mood data stay on your device. Nothing is sent to external servers.' },
        { title: 'No Public Sharing', desc: 'Your sensitive personal information is never shared publicly or with other users.' },
        { title: 'Optional Profile', desc: 'You can use Feelio without creating a detailed profile or sharing personal details.' },
      ].map((item) => (
        <View
          key={item.title}
          style={[styles.infoCard, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">{item.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">{item.desc}</ThemedText>
        </View>
      ))}

      <SectionHeader title="Safety & Moderation" />
      {[
        { title: 'Report & Block', desc: 'Report harmful behavior in Talk Space. Blocked users cannot contact you.' },
        { title: 'Community Guidelines', desc: 'Be kind, respectful, and never share personal contact information in chats.' },
        { title: 'Crisis Support', desc: 'Use the "I Need Help Now" button for immediate grounding exercises and crisis resources.' },
      ].map((item) => (
        <View
          key={item.title}
          style={[styles.infoCard, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">{item.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">{item.desc}</ThemedText>
        </View>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', padding: Spacing.four, borderRadius: BorderRadius.xl, gap: Spacing.two },
  emoji: { fontSize: 40 },
  heroTitle: { fontSize: 20 },
  heroText: { textAlign: 'center' },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.two,
  },
  settingText: { flex: 1, gap: 4 },
  infoCard: { padding: Spacing.three, borderRadius: BorderRadius.lg, gap: 4 },
});
