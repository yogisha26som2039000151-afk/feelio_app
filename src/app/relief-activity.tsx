import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { FeelioButton } from '@/components/feelio/feelio-button';
import { ScreenContainer } from '@/components/feelio/screen-container';
import { ThemedText } from '@/components/themed-text';
import {
  GROUNDING_STEPS,
  MEDITATION_STEPS,
  RELAXATION_SOUNDS,
  RELIEF_ACTIVITIES,
} from '@/constants/data';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useAppDataContext } from '@/contexts/app-data-context';
import { useTheme } from '@/hooks/use-theme';

export default function ReliefActivityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { earnBadge } = useAppDataContext();
  const activity = RELIEF_ACTIVITIES.find((a) => a.id === id);

  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);
  const [meditationStep, setMeditationStep] = useState(0);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (!active || activity?.type !== 'breathing') return;

    const interval = setInterval(() => {
      setSeconds((s) => {
        const next = s + 1;
        const cycle = next % 14;
        if (cycle < 4) setBreathPhase('inhale');
        else if (cycle < 8) setBreathPhase('hold');
        else setBreathPhase('exhale');

        if (breathPhase === 'inhale') {
          scale.value = withTiming(1.4, { duration: 1000 });
        } else if (breathPhase === 'exhale') {
          scale.value = withTiming(1, { duration: 1000 });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, activity?.type, breathPhase, scale]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const startBreathing = () => {
    setActive(true);
    setSeconds(0);
    scale.value = withRepeat(
      withSequence(withTiming(1.4, { duration: 4000 }), withTiming(1, { duration: 6000 })),
      -1,
    );
    earnBadge('breather');
  };

  if (!activity) {
    return (
      <ScreenContainer noTabInset>
        <ThemedText>Activity not found</ThemedText>
        <FeelioButton title="Go back" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noTabInset>
      <View style={styles.header}>
        <ThemedText style={styles.emoji}>{activity.emoji}</ThemedText>
        <ThemedText type="smallBold" style={styles.title}>{activity.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">{activity.description}</ThemedText>
      </View>

      {activity.type === 'breathing' && (
        <View style={styles.breathingWrap}>
          <Animated.View
            style={[
              styles.breathCircle,
              { backgroundColor: theme.primaryLight, borderColor: theme.primary },
              circleStyle,
            ]} />
          <ThemedText type="smallBold" style={styles.phase}>
            {active ? (breathPhase === 'inhale' ? 'Breathe in...' : breathPhase === 'hold' ? 'Hold...' : 'Breathe out...') : 'Ready?'}
          </ThemedText>
          {active && (
            <ThemedText type="small" themeColor="textSecondary">
              {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')} / 2:00
            </ThemedText>
          )}
          {!active ? (
            <FeelioButton title="Start Breathing" onPress={startBreathing} />
          ) : (
            <FeelioButton title="Stop" variant="outline" onPress={() => setActive(false)} />
          )}
        </View>
      )}

      {activity.type === 'grounding' && (
        <View style={styles.groundingWrap}>
          {GROUNDING_STEPS.map((step, i) => (
            <View
              key={step.sense}
              style={[
                styles.groundStep,
                {
                  backgroundColor: i <= groundingStep ? theme.primaryLight : theme.backgroundElement,
                  borderColor: i === groundingStep ? theme.primary : theme.border,
                },
              ]}>
              <ThemedText type="smallBold">{step.count} — {step.sense}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{step.prompt}</ThemedText>
            </View>
          ))}
          <FeelioButton
            title={groundingStep < GROUNDING_STEPS.length - 1 ? 'Next step' : 'Complete'}
            onPress={() => {
              if (groundingStep < GROUNDING_STEPS.length - 1) setGroundingStep((s) => s + 1);
              else router.back();
            }}
          />
        </View>
      )}

      {activity.type === 'meditation' && (
        <View style={styles.meditationWrap}>
          <View style={[styles.meditationCard, { backgroundColor: theme.secondaryLight }]}>
            <ThemedText type="small">{MEDITATION_STEPS[meditationStep]}</ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            Step {meditationStep + 1} of {MEDITATION_STEPS.length}
          </ThemedText>
          <FeelioButton
            title={meditationStep < MEDITATION_STEPS.length - 1 ? 'Next' : 'Finish'}
            onPress={() => {
              if (meditationStep < MEDITATION_STEPS.length - 1) setMeditationStep((s) => s + 1);
              else router.back();
            }}
          />
        </View>
      )}

      {activity.type === 'sounds' && (
        <View style={styles.soundsWrap}>
          {RELAXATION_SOUNDS.map((sound) => (
            <FeelioButton
              key={sound.id}
              title={`${sound.emoji} ${sound.name}`}
              variant={selectedSound === sound.id ? 'primary' : 'outline'}
              onPress={() => setSelectedSound(sound.id)}
            />
          ))}
          {selectedSound && (
            <View style={[styles.playing, { backgroundColor: theme.primaryLight }]}>
              <ThemedText type="smallBold">Now playing: {RELAXATION_SOUNDS.find((s) => s.id === selectedSound)?.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Close your eyes and let the sounds wash over you. (Audio playback coming soon)
              </ThemedText>
            </View>
          )}
        </View>
      )}

      {(activity.type === 'stretch' || activity.type === 'gratitude') && (
        <View style={[styles.staticActivity, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">
            {activity.type === 'stretch' ? 'Desk Stretch Guide' : 'Gratitude Pause'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {activity.type === 'stretch'
              ? '1. Roll your shoulders back 5 times\n2. Stretch your neck gently side to side\n3. Reach your arms overhead and hold for 10 seconds\n4. Twist your torso gently left and right\n5. Shake out your hands and take a deep breath'
              : 'Take a moment to name three small things you appreciate right now. They can be as simple as a warm cup of tea, a kind message, or a comfortable chair.'}
          </ThemedText>
          <FeelioButton title="Done" onPress={() => router.back()} />
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', gap: Spacing.two, marginBottom: Spacing.three },
  emoji: { fontSize: 48 },
  title: { fontSize: 22 },
  breathingWrap: { alignItems: 'center', gap: Spacing.three, paddingVertical: Spacing.four },
  breathCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
  },
  phase: { fontSize: 18 },
  groundingWrap: { gap: Spacing.two },
  groundStep: { padding: Spacing.three, borderRadius: BorderRadius.lg, borderWidth: 2, gap: 4 },
  meditationWrap: { gap: Spacing.three, alignItems: 'center' },
  meditationCard: { padding: Spacing.four, borderRadius: BorderRadius.lg, width: '100%' },
  soundsWrap: { gap: Spacing.two },
  playing: { padding: Spacing.three, borderRadius: BorderRadius.lg, gap: Spacing.one },
  staticActivity: { padding: Spacing.four, borderRadius: BorderRadius.lg, gap: Spacing.three },
});
