import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, TextInput, View } from 'react-native';

import { FeelioButton } from '@/components/feelio/feelio-button';
import { ParticipantSwitcher } from '@/components/feelio/participant-switcher';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { SectionHeader } from '@/components/feelio/section-header';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function PrivacyScreen() {
  const theme = useTheme();
  const {
    participants,
    currentParticipant,
    maxParticipants,
    switchParticipant,
    addParticipant,
    resetCurrentParticipant,
    clearAllParticipants,
  } = useAppDataContext();
  const [newLabel, setNewLabel] = useState('');

  const handleAddParticipant = async () => {
    const added = await addParticipant(newLabel);
    if (!added) {
      Alert.alert('Limit reached', `You can store up to ${maxParticipants} people on this device.`);
      return;
    }
    setNewLabel('');
  };

  const handleResetCurrent = () => {
    const name = currentParticipant?.label ?? 'this participant';
    const message =
      'This clears mood, journal, pulse, goals, and badges for the active profile only. Other people are unchanged.';
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Reset ${name}?\n\n${message}`)) {
        resetCurrentParticipant();
      }
      return;
    }
    Alert.alert(`Reset ${name}?`, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetCurrentParticipant() },
    ]);
  };

  const handleClearAll = () => {
    const message =
      'This deletes every profile and all stored moods, journals, and pulses. The app starts again with a single empty Participant 1.';
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(`Clear all participants?\n\n${message}`)) {
        clearAllParticipants();
      }
      return;
    }
    Alert.alert('Clear all participants?', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear all', style: 'destructive', onPress: () => clearAllParticipants() },
    ]);
  };

  return (
    <ScreenContainer noTabInset>
      <View style={[styles.hero, { backgroundColor: theme.primaryLight }]}>
        <ThemedText style={styles.emoji}>🔒</ThemedText>
        <ThemedText type="smallBold" style={styles.heroTitle}>Your Privacy Matters</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.heroText}>
          Feelio is designed with your safety and privacy at the center.
        </ThemedText>
      </View>

      <SectionHeader
        title="Survey profiles"
        subtitle={`${participants.length} of ${maxParticipants} people on this device`}
      />
      <View style={[styles.surveyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <ThemedText type="small" themeColor="textSecondary">
          Each person gets a separate on-device store. Switch before they start using the app.
        </ThemedText>
        {currentParticipant ? (
          <ThemedText type="smallBold">Active: {currentParticipant.label}</ThemedText>
        ) : null}
        <ParticipantSwitcher
          participants={participants}
          currentId={currentParticipant?.id}
          onSelect={switchParticipant}
        />
        {participants.length < maxParticipants ? (
          <>
            <TextInput
              style={[styles.nameInput, { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text }]}
              placeholder="Name or code (e.g. P3)"
              placeholderTextColor={theme.textSecondary}
              value={newLabel}
              onChangeText={setNewLabel}
            />
            <FeelioButton title="Add person" variant="outline" onPress={handleAddParticipant} />
          </>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            Maximum of {maxParticipants} profiles reached.
          </ThemedText>
        )}
        <FeelioButton title="View report tables" onPress={() => router.push('/survey-export')} />
        <FeelioButton
          title={`Reset ${currentParticipant?.label ?? 'current'} data`}
          variant="outline"
          onPress={handleResetCurrent}
        />
        <FeelioButton title="Clear all participant data" variant="crisis" onPress={handleClearAll} />
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
        { title: 'Crisis Support', desc: 'Use the "I Need Help Now" button for immediate grounding exercises and crisis resources.' },
        { title: 'Community Guidelines', desc: 'Be kind, respectful, and never share personal contact information.' },
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
  surveyCard: {
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.two + 4,
    fontSize: 16,
  },
  infoCard: { padding: Spacing.three, borderRadius: BorderRadius.lg, gap: 4 },
});
