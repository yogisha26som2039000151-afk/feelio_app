import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1625',
    background: '#FAF8FF',
    backgroundElement: '#F0EDF8',
    backgroundSelected: '#E4DFF5',
    textSecondary: '#6B6580',
    primary: '#7C6BF0',
    primaryLight: '#EDE9FE',
    secondary: '#5BB5A2',
    secondaryLight: '#E0F5F0',
    accent: '#FFB4A2',
    accentLight: '#FFF0EC',
    crisis: '#E85D5D',
    crisisLight: '#FDEAEA',
    success: '#5BB5A2',
    card: '#FFFFFF',
    border: '#E8E4F0',
  },
  dark: {
    text: '#F5F3FF',
    background: '#1A1625',
    backgroundElement: '#2A2540',
    backgroundSelected: '#3A3455',
    textSecondary: '#A8A3B8',
    primary: '#9B8FF5',
    primaryLight: '#2D2850',
    secondary: '#6ECFB8',
    secondaryLight: '#1E3A35',
    accent: '#FFB4A2',
    accentLight: '#3D2E2A',
    crisis: '#FF7B7B',
    crisisLight: '#3D2020',
    success: '#6ECFB8',
    card: '#242038',
    border: '#3A3455',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
