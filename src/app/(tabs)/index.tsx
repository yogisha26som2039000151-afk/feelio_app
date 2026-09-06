import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ChipSelector } from '@/components/feelio/chip-selector';
import { EmotionPicker } from '@/components/feelio/emotion-picker';
import { FeatureCard } from '@/components/feelio/feature-card';
import { FeelioButton } from '@/components/feelio/feelio-button';
import { ParticipantSwitcher } from '@/components/feelio/participant-switcher';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { SectionHeader } from '@/components/feelio/section-header';
import { ThemedText } from '@/components/themed-text';
import { EMOTIONS, PULSE_AFFECTING, PULSE_HELP } from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

type PulseStep = 'feeling' | 'affecting' | 'help' | 'done';

export default function HomeScreen() {
  const theme = useTheme();
  const { data, addPulse, currentParticipant, dataRevision, participants, switchParticipant } =
    useAppDataContext();
  const [step, setStep] = useState<PulseStep>('feeling');
  const [feeling, setFeeling] = useState('');
  const [affecting, setAffecting] = useState<string[]>([]);
  const [help, setHelp] = useState<string[]>([]);
  const [editingPulse, setEditingPulse] = useState(false);

  useEffect(() => {
    setStep('feeling');
    setFeeling('');
    setAffecting([]);
    setHelp([]);
    setEditingPulse(false);
  }, [currentParticipant?.id, dataRevision]);

  const todayPulse = data.pulseHistory.find(
    (p) => p.date.split('T')[0] === new Date().toISOString().split('T')[0],
  );
  const showPulseDone = todayPulse && !editingPulse && step !== 'affecting' && step !== 'help';

  const handleSavePulse = async () => {
    await addPulse({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      feeling,
      affecting,
      help,
    });
    setStep('done');
    setEditingPulse(false);
  };

  const toggleAffecting = (item: string) => {
    setAffecting((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const toggleHelp = (item: string) => {
    setHelp((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const feelingEmoji = EMOTIONS.find((e) => e.id === feeling)?.emoji;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <ThemedText style={styles.greeting}>Welcome to Feelio</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Your safe space for mental wellness
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Tap a person to switch profiles
        </ThemedText>
        <ParticipantSwitcher
          participants={participants}
          currentId={currentParticipant?.id}
          onSelect={switchParticipant}
        />
      </View>

      <View style={[styles.pulseCard, { backgroundColor: theme.primaryLight, borderColor: theme.primary }]}>
        <ThemedText style={styles.pulseEmoji}>💜</ThemedText>
        <ThemedText type="smallBold" style={styles.pulseTitle}>Feelio Pulse</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.pulseSubtitle}>
          Your daily check-in in 3 simple steps
        </ThemedText>

        {showPulseDone ? (
          <View style={styles.doneWrap}>
            <ThemedText style={styles.doneEmoji}>{EMOTIONS.find((e) => e.id === todayPulse.feeling)?.emoji}</ThemedText>
            <ThemedText type="smallBold">Today's pulse recorded</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              You're feeling {EMOTIONS.find((e) => e.id === todayPulse.feeling)?.label?.toLowerCase()}
            </ThemedText>
            <FeelioButton title="Update today's pulse" variant="outline" onPress={() => { setEditingPulse(true); setStep('feeling'); }} />
          </View>
        ) : step === 'feeling' ? (
          <View style={styles.stepWrap}>
            <ThemedText type="smallBold" style={styles.stepQuestion}>How are you feeling?</ThemedText>
            <EmotionPicker selected={feeling} onSelect={setFeeling} />
            <FeelioButton title="Next" onPress={() => setStep('affecting')} disabled={!feeling} />
          </View>
        ) : step === 'affecting' ? (
          <View style={styles.stepWrap}>
            <ThemedText type="smallBold" style={styles.stepQuestion}>What might be affecting you?</ThemedText>
            <ChipSelector options={PULSE_AFFECTING} selected={affecting} onToggle={toggleAffecting} />
            <View style={styles.stepButtons}>
              <FeelioButton title="Back" variant="outline" onPress={() => setStep('feeling')} />
              <FeelioButton title="Next" onPress={() => setStep('help')} />
            </View>
          </View>
        ) : step === 'help' ? (
          <View style={styles.stepWrap}>
            <ThemedText type="smallBold" style={styles.stepQuestion}>What could help right now?</ThemedText>
            <ChipSelector options={PULSE_HELP} selected={help} onToggle={toggleHelp} />
            <View style={styles.stepButtons}>
              <FeelioButton title="Back" variant="outline" onPress={() => setStep('affecting')} />
              <FeelioButton title="Save" onPress={handleSavePulse} />
            </View>
          </View>
        ) : (
          <View style={styles.doneWrap}>
            <ThemedText style={styles.doneEmoji}>{feelingEmoji}</ThemedText>
            <ThemedText type="smallBold">Pulse saved!</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.doneText}>
              {help.includes('Breathing exercise') && 'Try a quick breathing exercise in Quick Relief.'}
              {help.includes('Journal my thoughts') && 'Your journal is ready whenever you need it.'}
              {help.includes('Talk to someone') && 'Reach out to someone you trust, or use I Need Help Now for support resources.'}
              {!help.length && 'Take things one step at a time. You\'re doing great.'}
            </ThemedText>
          </View>
        )}
      </View>

      <SectionHeader title="Quick Access" />
      <View style={styles.quickGrid}>
        <FeatureCard
          title="Quick Relief"
          description="Breathing & grounding"
          emoji="🧘"
          color={theme.secondary}
          onPress={() => router.push('/relief')}
          compact
        />
        <FeatureCard
          title="Learn"
          description="Mental health topics"
          emoji="🧠"
          color={theme.primary}
          onPress={() => router.push('/learn')}
          compact
        />
        <FeatureCard
          title="Growth"
          description="Goals & achievements"
          emoji="🎯"
          color={theme.accent}
          onPress={() => router.push('/growth')}
          compact
        />
        <FeatureCard
          title="Privacy"
          description="Safety controls"
          emoji="🔒"
          color={theme.textSecondary}
          onPress={() => router.push('/privacy')}
          compact
        />
      </View>

      {data.moods.length > 0 && (
        <>
          <SectionHeader
            title="Recent Mood"
            action="See all"
            onAction={() => router.push('/mood-history')}
          />
          <View style={[styles.moodPreview, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {data.moods.slice(0, 5).map((m) => {
              const emotion = EMOTIONS.find((e) => e.id === m.emotionId);
              return (
                <View key={m.id} style={styles.moodDot}>
                  <ThemedText style={styles.moodEmoji}>{emotion?.emoji}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.moodDate}>
                    {new Date(m.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.one, paddingTop: Spacing.three },
  greeting: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
  pulseCard: {
    padding: Spacing.four,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.two,
  },
  pulseEmoji: { fontSize: 36, lineHeight: 44 },
  pulseTitle: { fontSize: 20 },
  pulseSubtitle: { textAlign: 'center' },
  stepWrap: { width: '100%', gap: Spacing.three, alignItems: 'stretch' },
  stepQuestion: { fontSize: 16, textAlign: 'center' },
  stepButtons: { flexDirection: 'row', gap: Spacing.two },
  doneWrap: { alignItems: 'center', gap: Spacing.two, width: '100%' },
  doneEmoji: { fontSize: 48, lineHeight: 58 },
  doneText: { textAlign: 'center' },
  quickGrid: { gap: Spacing.two },
  moodPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.three,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  moodDot: { alignItems: 'center', gap: 4 },
  moodEmoji: { fontSize: 28, lineHeight: 36 },
  moodDate: { fontSize: 11 },
});
