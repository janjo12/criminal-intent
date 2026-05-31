import { router, Stack } from "expo-router";
import { View } from "react-native";

import { HeaderIconButton } from "@/components/HeaderIconButton";
import { CrimeFlatListScreen } from "@/components/CrimeListScreen";
import { useCrimeList } from "@/hooks/useCrimeList";

const headerButtonOffset = 34;

export default function Index() {
  const { addCrime, crimes } = useCrimeList();

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 4, paddingTop: headerButtonOffset }}>
              <HeaderIconButton accessibilityLabel="Add crime" icon="plus" onPress={addCrime} />
              <HeaderIconButton accessibilityLabel="Settings" icon="cog" onPress={() => router.push("/settings")} />
            </View>
          ),
          title: "Criminal Intent",
        }}
      />
      <CrimeFlatListScreen
        crimes={crimes}
        onOpenCrime={(crime) => router.push({ pathname: "/crime/[id]", params: { id: crime.id } })}
      />
    </>
  );
}
