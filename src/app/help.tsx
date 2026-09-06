import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, TextInput, View } from 'react-native';

import { FeatureCard } from '@/components/feelio/feature-card';
import { FeelioButton } from '@/components/feelio/feelio-button';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { SectionHeader } from '@/components/feelio/section-header';
import { ThemedText } from '@/components/themed-text';
import { CRISIS_RESOURCES } from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function HelpScreen() {
  const theme = useTheme();
  const { data, setTrustedContact } = useAppDataContext();
  const [contact, setContact] = useState(data.trustedContact ?? '');

  return (
    <ScreenContainer noTabInset>
      <View style={[styles.crisisBanner, { backgroundColor: theme.crisisLight }]}>
        <ThemedText style={styles.crisisEmoji}>🚨</ThemedText>
        <ThemedText type="smallBold" style={{ color: theme.crisis }}>I Need Help Now</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.crisisText}>
          You're not alone. Help is available right now.
        </ThemedText>
      </View>

      <SectionHeader title="Immediate Grounding" />
      <FeatureCard
        title="2-Minute Breathing"
        description="Calm your nervous system"
        emoji="🌬️"
        color={theme.secondary}
        onPress={() => router.push({ pathname: '/relief-activity', params: { id: 'breathing' } })}
      />
      <FeatureCard
        title="5-4-3-2-1 Grounding"
        description="Anchor yourself in the present"
        emoji="🌍"
        color={theme.primary}
        onPress={() => router.push({ pathname: '/relief-activity', params: { id: 'grounding' } })}
      />

      <SectionHeader title="Trusted Contact" subtitle="Someone you can reach out to" />
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
        placeholder="Name or phone number"
        placeholderTextColor={theme.textSecondary}
        value={contact}
        onChangeText={setContact}
      />
      <FeelioButton title="Save Contact" variant="outline" onPress={() => setTrustedContact(contact)} />
      {data.trustedContact && (
        <ThemedText type="small" themeColor="textSecondary">
          Saved: {data.trustedContact}
        </ThemedText>
      )}

      <SectionHeader title="Crisis Resources" />
      {CRISIS_RESOURCES.map((resource) => (
        <View
          key={resource.name}
          style={[styles.resourceCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText type="smallBold">{resource.name}</ThemedText>
          <ThemedText type="small" style={{ color: theme.crisis }}>{resource.number}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">{resource.description}</ThemedText>
          <FeelioButton
            title="Call / Visit"
            variant="crisis"
            onPress={() => {
              const isUrl = resource.number.startsWith('http');
              Linking.openURL(isUrl ? resource.number : `tel:${resource.number.replace(/\D/g, '')}`);
            }}
          />
        </View>
      ))}

      <FeelioButton title="Close" variant="outline" onPress={() => router.dismiss()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  crisisBanner: { alignItems: 'center', padding: Spacing.four, borderRadius: BorderRadius.xl, gap: Spacing.two },
  crisisEmoji: { fontSize: 40 },
  crisisText: { textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    fontSize: 16,
  },
  resourceCard: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.one,
  },
});
