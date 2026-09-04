export const RELAXATION_SOUND_SOURCES = {
  rain: require('../../assets/sounds/rain.mp3'),
  ocean: require('../../assets/sounds/ocean.mp3'),
  forest: require('../../assets/sounds/forest.mp3'),
  wind: require('../../assets/sounds/wind.mp3'),
} as const;

export type RelaxationSoundId = keyof typeof RELAXATION_SOUND_SOURCES;
