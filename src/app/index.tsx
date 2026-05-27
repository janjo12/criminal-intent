import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { CrimeRow } from "@/components/CrimeRow";
import { ScreenHeader } from "@/components/ScreenHeader";
import { useSettings } from "@/context/SettingsContext";
import { createEmptyCrime, listCrimes, saveCrime } from "@/lib/crimeStorage";
import type { Crime } from "@/lib/types";

export default function Index() {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const { settings } = useSettings();

  const refreshCrimes = useCallback(async () => {
    const storedCrimes = await listCrimes();
    setCrimes(storedCrimes);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshCrimes();
    }, [refreshCrimes])
  );

  async function addCrime() {
    const crime = await createEmptyCrime();
    await saveCrime(crime);
    router.push({ pathname: "/crime/[id]", params: { id: crime.id } });
  }

  return (
    <View
      accessibilityLabel={settings.darkMode ? "Crime list dark theme" : "Crime list light theme"}
      style={[styles.container, settings.darkMode ? styles.darkContainer : styles.lightContainer]}
      testID="index-screen"
    >
      <ScreenHeader title="Criminal Intent" showAdd onAdd={addCrime} />
      <FlatList
        ListEmptyComponent={<Text style={styles.empty}>No crime reports yet.</Text>}
        data={crimes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CrimeRow
            crime={item}
            settings={settings}
            onPress={() => router.push({ pathname: "/crime/[id]", params: { id: item.id } })}
          />
        )}
        testID="crime-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: "#111827",
  },
  empty: {
    color: "#64748b",
    fontSize: 16,
    padding: 24,
    textAlign: "center",
  },
  lightContainer: {
    backgroundColor: "#f8fafc",
  },
});
