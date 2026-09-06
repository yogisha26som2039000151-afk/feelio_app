import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppDataProvider } from '@/contexts/app-data-context';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

const FeelioLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};

const FeelioDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? FeelioDarkTheme : FeelioLightTheme}>
      <AppDataProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="help" options={{ presentation: 'modal' }} />
          <Stack.Screen name="mood-history" options={{ headerShown: true, title: 'Mood History' }} />
          <Stack.Screen name="journal-entry" options={{ presentation: 'modal', title: 'New Entry' }} />
          <Stack.Screen name="relief" options={{ headerShown: true, title: 'Quick Relief' }} />
          <Stack.Screen name="relief-activity" options={{ headerShown: true, title: 'Activity' }} />
          <Stack.Screen name="learn" options={{ headerShown: true, title: 'Learn' }} />
          <Stack.Screen name="learn-topic" options={{ headerShown: true, title: 'Article' }} />
          <Stack.Screen name="growth" options={{ headerShown: true, title: 'Personal Growth' }} />
          <Stack.Screen name="privacy" options={{ headerShown: true, title: 'Privacy & Safety' }} />
          <Stack.Screen name="survey-export" options={{ headerShown: true, title: 'Survey report' }} />
        </Stack>
      </AppDataProvider>
    </ThemeProvider>
  );
}
