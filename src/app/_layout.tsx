import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";

import { useSettings } from "@/components/SettingsContent";

export default function RootLayout() {
  const { isHydrated, settings } = useSettings();

  return (
    <ThemeProvider value={isHydrated && settings.darkMode ? DarkTheme : DefaultTheme}>
      <Stack />
    </ThemeProvider>
  );
}