import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FeelioButton } from '@/components/feelio/feelio-button';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { ThemedText } from '@/components/themed-text';
import { TALK_RESPONSES } from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';
import type { ChatMessage } from '@/types';

type ChatMode = 'menu' | 'peer' | 'professional' | 'listen';

export default function TalkScreen() {
  const theme = useTheme();
  const { earnBadge } = useAppDataContext();
  const [mode, setMode] = useState<ChatMode>('menu');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const startChat = (chatMode: ChatMode) => {
    setMode(chatMode);
    const greetings: Record<string, string> = {
      peer: "Hi there! I'm a trained peer supporter. I'm here to listen without judgment. How are you feeling today?",
      professional: "Hello! You've reached the professional support line. A licensed counselor will be with you shortly. In the meantime, feel free to share what's on your mind.",
      listen: "I'm here. You don't need to say anything specific — just share whatever's on your heart. I'm listening.",
    };
    setMessages([
      {
        id: '1',
        text: greetings[chatMode] ?? greetings.peer,
        sender: 'supporter',
        timestamp: new Date().toISOString(),
      },
    ]);
    earnBadge('helper');
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    const response: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: TALK_RESPONSES[Math.floor(Math.random() * TALK_RESPONSES.length)],
      sender: 'supporter',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg, response]);
    setInput('');
  };

  if (mode === 'menu') {
    return (
      <ScreenContainer>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Talk Space</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Anonymous, safe conversations when you need support
          </ThemedText>
        </View>

        <View style={[styles.anonBanner, { backgroundColor: theme.primaryLight }]}>
          <ThemedText type="small">🕶️ You're chatting anonymously. Your identity is protected.</ThemedText>
        </View>

        <Pressable
          onPress={() => startChat('listen')}
          style={[styles.optionCard, { backgroundColor: theme.card, borderColor: theme.primary }]}>
          <ThemedText style={styles.optionEmoji}>👂</ThemedText>
          <View style={styles.optionText}>
            <ThemedText type="smallBold">I just need someone to listen</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              No advice needed — just a caring ear
            </ThemedText>
          </View>
        </Pressable>

        <Pressable
          onPress={() => startChat('peer')}
          style={[styles.optionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.optionEmoji}>💬</ThemedText>
          <View style={styles.optionText}>
            <ThemedText type="smallBold">Chat with a peer supporter</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Trained volunteers who understand what you're going through
            </ThemedText>
          </View>
        </Pressable>

        <Pressable
          onPress={() => startChat('professional')}
          style={[styles.optionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <ThemedText style={styles.optionEmoji}>🩺</ThemedText>
          <View style={styles.optionText}>
            <ThemedText type="smallBold">Connect with a professional</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Licensed mental health counselors
            </ThemedText>
          </View>
        </Pressable>

        <View style={[styles.rules, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">Community Guidelines</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            • Be kind and respectful{'\n'}
            • No sharing of personal contact info{'\n'}
            • Report harmful behavior{'\n'}
            • This is not a substitute for emergency care
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.chatContainer, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.chatHeader, { borderBottomColor: theme.border }]}>
        <Pressable onPress={() => { setMode('menu'); setMessages([]); }}>
          <ThemedText type="linkPrimary">← Back</ThemedText>
        </Pressable>
        <ThemedText type="smallBold">
          {mode === 'listen' ? 'Listening Space' : mode === 'peer' ? 'Peer Supporter' : 'Professional Support'}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">Anonymous</ThemedText>
      </View>

      <ScreenContainer noTabInset contentContainerStyle={styles.chatMessages}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.sender === 'user'
                ? [styles.userBubble, { backgroundColor: theme.primary }]
                : [styles.supporterBubble, { backgroundColor: theme.card, borderColor: theme.border }],
            ]}>
            <ThemedText
              type="small"
              style={msg.sender === 'user' ? styles.userText : undefined}>
              {msg.text}
            </ThemedText>
          </View>
        ))}
      </ScreenContainer>

      <View style={[styles.inputBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TextInput
          style={[styles.chatInput, { color: theme.text }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.textSecondary}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <FeelioButton title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.one },
  title: { fontSize: 26, fontWeight: '700' },
  anonBanner: { padding: Spacing.two, borderRadius: BorderRadius.md },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    gap: Spacing.three,
  },
  optionEmoji: { fontSize: 32 },
  optionText: { flex: 1, gap: 4 },
  rules: { padding: Spacing.three, borderRadius: BorderRadius.lg, gap: Spacing.one },
  chatContainer: { flex: 1 },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
    borderBottomWidth: 1,
  },
  chatMessages: { gap: Spacing.two, paddingBottom: Spacing.three },
  bubble: { maxWidth: '85%', padding: Spacing.two, borderRadius: BorderRadius.lg },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  supporterBubble: { alignSelf: 'flex-start', borderWidth: 1, borderBottomLeftRadius: 4 },
  userText: { color: '#fff' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.two,
    gap: Spacing.two,
    borderTopWidth: 1,
  },
  chatInput: { flex: 1, fontSize: 16, maxHeight: 100, padding: Spacing.two },
});
