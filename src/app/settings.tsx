import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsScreen() {
  const { settings, setDarkMode, setDateFormat } = useSettings();

  return (
    <View style={[styles.container, settings.darkMode ? styles.darkContainer : styles.lightContainer]}>
      <ScreenHeader title="Settings" showSettings={false} />
      <View style={styles.content}>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.label}>Dark Mode</Text>
            <Text style={styles.description}>Use a darker background on app screens.</Text>
          </View>
          <Switch accessibilityLabel="Dark mode" onValueChange={setDarkMode} value={settings.darkMode} />
        </View>

        <View style={styles.settingBlock}>
          <Text style={styles.label}>Date Format</Text>
          <Pressable
            accessibilityLabel="Date format"
            accessibilityRole="button"
            onPress={() => undefined}
            style={styles.segmentedControl}
          >
            <Pressable accessibilityRole="button" onPress={() => setDateFormat("medium")}>
              <Text style={[styles.segment, settings.dateFormat === "medium" && styles.activeSegment]}>Medium</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => setDateFormat("iso")}>
              <Text style={[styles.segment, settings.dateFormat === "iso" && styles.activeSegment]}>ISO</Text>
            </Pressable>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeSegment: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },
  container: {
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 18,
  },
  darkContainer: {
    backgroundColor: "#111827",
  },
  description: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 3,
  },
  label: {
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "800",
  },
  lightContainer: {
    backgroundColor: "#f8fafc",
  },
  segmentedControl: {
    alignSelf: "flex-start",
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 10,
    padding: 4,
  },
  segment: {
    borderRadius: 6,
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "700",
    minWidth: 88,
    paddingHorizontal: 14,
    paddingVertical: 9,
    textAlign: "center",
  },
  settingBlock: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
  },
  settingRow: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  settingText: {
    flex: 1,
    paddingRight: 12,
  },
});
