import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FeelioButton } from '@/components/feelio/feelio-button';
import { ThemedText } from '@/components/themed-text';
import { RELAXATION_SOUNDS } from '@/constants/data';
import { RELAXATION_SOUND_SOURCES, type RelaxationSoundId } from '@/constants/sounds';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function RelaxationSounds() {
  const theme = useTheme();
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [selectedSound, setSelectedSound] = useState<RelaxationSoundId | null>(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  const toggleSound = (soundId: RelaxationSoundId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (selectedSound === soundId && status.playing) {
      player.pause();
      return;
    }

    const sound = RELAXATION_SOUNDS.find((s) => s.id === soundId);
    player.replace(RELAXATION_SOUND_SOURCES[soundId]);
    player.loop = true;
    player.volume = 0.75;
    player.play();

    if (sound) {
      player.setActiveForLockScreen(true, {
        title: sound.name,
        artist: 'Feelio',
        albumTitle: 'Relaxation Sounds',
      });
    }

    setSelectedSound(soundId);
  };

  const stopSound = () => {
    player.pause();
    player.seekTo(0);
    player.setActiveForLockScreen(false);
    setSelectedSound(null);
  };

  const activeSound = RELAXATION_SOUNDS.find((s) => s.id === selectedSound);

  return (
    <View style={styles.wrap}>
      {RELAXATION_SOUNDS.map((sound) => {
        const isActive = selectedSound === sound.id;
        const isPlaying = isActive && status.playing;

        return (
          <FeelioButton
            key={sound.id}
            title={`${sound.emoji} ${sound.name}${isPlaying ? ' ▮▮' : isActive ? ' ▶' : ''}`}
            variant={isActive ? 'primary' : 'outline'}
            onPress={() => toggleSound(sound.id)}
          />
        );
      })}

      {selectedSound && activeSound && (
        <View style={[styles.playing, { backgroundColor: theme.primaryLight }]}>
          <View style={styles.playingHeader}>
            <ThemedText style={styles.playingEmoji}>{activeSound.emoji}</ThemedText>
            <View style={styles.playingInfo}>
              <ThemedText type="smallBold">
                {status.playing ? 'Now playing' : 'Paused'}: {activeSound.name}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {status.playing
                  ? 'Close your eyes and let the sounds wash over you'
                  : 'Tap the sound above to resume'}
              </ThemedText>
            </View>
          </View>

          {status.isLoaded && status.duration > 0 && (
            <ThemedText type="small" themeColor="textSecondary" style={styles.timer}>
              {formatTime(status.currentTime)} · loops seamlessly
            </ThemedText>
          )}

          <View style={styles.controls}>
            <FeelioButton
              title={status.playing ? 'Pause' : 'Play'}
              variant="secondary"
              onPress={() => {
                if (status.playing) player.pause();
                else player.play();
              }}
            />
            <FeelioButton title="Stop" variant="outline" onPress={stopSound} />
          </View>
        </View>
      )}

      <ThemedText type="small" themeColor="textSecondary" style={styles.credit}>
        Rain, ocean, and forest from Mixkit. Wind from Pixabay (storegraphic).
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  playing: { padding: Spacing.three, borderRadius: BorderRadius.lg, gap: Spacing.two },
  playingHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  playingEmoji: { fontSize: 36 },
  playingInfo: { flex: 1, gap: 4 },
  timer: { textAlign: 'center' },
  controls: { flexDirection: 'row', gap: Spacing.two },
  credit: { textAlign: 'center', fontSize: 11, marginTop: Spacing.one },
});
