import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { FeelioButton } from '@/components/feelio/feelio-button';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function JournalEntryScreen() {
  const theme = useTheme();
  const { prompt } = useLocalSearchParams<{ prompt: string }>();
  const { addJournal } = useAppDataContext();
  const [content, setContent] = useState('');
  const [hasVoiceNote, setHasVoiceNote] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    await addJournal({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      prompt: prompt ?? 'Free write',
      content: content.trim(),
      hasVoiceNote,
    });
    router.back();
  };

  const handleVoiceNote = () => {
    Alert.alert(
      'Voice Note',
      'Voice recording will be available in a future update. For now, you can mark this entry as having a voice note intention.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark as voice note', onPress: () => setHasVoiceNote(true) },
      ],
    );
  };

  return (
    <ScreenContainer noTabInset>
      <ThemedText type="smallBold" style={styles.prompt}>{prompt}</ThemedText>

      <TextInput
        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
        placeholder="Start writing..."
        placeholderTextColor={theme.textSecondary}
        value={content}
        onChangeText={setContent}
        multiline
        autoFocus
      />

      <FeelioButton
        title={hasVoiceNote ? '🎙️ Voice note marked' : '🎙️ Add voice note'}
        variant="outline"
        onPress={handleVoiceNote}
      />

      <View style={styles.actions}>
        <FeelioButton title="Cancel" variant="outline" onPress={() => router.back()} />
        <FeelioButton title="Save Entry" onPress={handleSave} disabled={!content.trim()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  prompt: { fontSize: 20, marginBottom: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.three,
    minHeight: 200,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
  },
  actions: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
});
