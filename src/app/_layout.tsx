import { Stack } from "expo-router";

import { SettingsProvider } from "@/components/SettingsContent";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SettingsProvider>
  );
}
