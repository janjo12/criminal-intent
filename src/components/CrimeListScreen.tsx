import { FlatList, StyleSheet, Text } from "react-native";

import { CrimeRow } from "./CrimeRow";
import { ScreenFrame } from "./ScreenFrame";
import { useSettings } from "./SettingsContent";

import type { Crime } from "./CrimeRow";

type CrimeListScreenProps = {
  crimes: Crime[];
  onAddCrime: () => void;
  onOpenCrime: (crime: Crime) => void;
};

export function CrimeFlatListScreen({ crimes, onAddCrime, onOpenCrime }: CrimeListScreenProps) {
  const { settings } = useSettings();

  return (
    <ScreenFrame
      accessibilityLabel={settings.darkMode ? "Crime list dark theme" : "Crime list light theme"}
      darkMode={settings.darkMode}
      onAdd={onAddCrime}
      showAdd
      showBack={false}
      testID="index-screen"
      title="Criminal Intent"
    >
      <FlatList
        ListEmptyComponent={
          <Text style={[styles.empty, settings.darkMode ? styles.darkEmpty : styles.lightEmpty]}>No crime reports yet.</Text>
        }
        data={crimes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CrimeRow crime={item} settings={settings} onPress={() => onOpenCrime(item)} />}
        testID="crime-list"
      />
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  darkEmpty: {
    color: "#cbd5e1",
  },
  empty: {
    fontSize: 16,
    padding: 24,
    textAlign: "center",
  },
  lightEmpty: {
    color: "#64748b",
  },
});
