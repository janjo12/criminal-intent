import { router, Stack } from "expo-router";

import { HeaderIconButton } from "@/components/HeaderIconButton";
import { SettingsContent } from "@/components/SettingsContent";

const headerButtonOffset = 34;

export default function SettingsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerLeft: () => (
            <HeaderIconButton
              accessibilityLabel="Go back"
              icon="arrow-left"
              onPress={() => router.back()}
              style={{ marginTop: headerButtonOffset }}
            />
          ),
          headerRight: undefined,
          title: "Settings",
        }}
      />
      <SettingsContent />
    </>
  );
}
