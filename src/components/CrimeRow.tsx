import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatCrimeDate } from "@/models/crime";
import type { AppSettings } from "./SettingsContent";
import type { Crime } from "@/models/crime";

type CrimeRowProps = {
  crime: Crime;
  settings: AppSettings;
  onPress: () => void;
};

export function CrimeRow({ crime, settings, onPress }: CrimeRowProps) {
  const title = crime.title.trim() || "Untitled Crime";
  const isDark = settings.darkMode;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, isDark ? styles.darkRow : styles.lightRow, pressed && styles.pressed]}
    >
      <View style={styles.textColumn}>
        <Text style={[styles.title, isDark ? styles.darkTitle : styles.lightTitle]}>{title}</Text>
        <Text style={[styles.date, isDark ? styles.darkDate : styles.lightDate]}>
          {formatCrimeDate(crime.date, settings.dateFormat)}
        </Text>
      </View>
      {crime.solved ? (
        <MaterialCommunityIcons
          accessibilityLabel={`${title} solved handcuff`}
          color={isDark ? "#e2e8f0" : "#334155"}
          name="handcuffs"
          size={24}
          style={styles.handcuff}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  darkDate: {
    color: "#cbd5e1",
  },
  darkRow: {
    backgroundColor: "#1f2937",
    borderBottomColor: "#334155",
  },
  darkTitle: {
    color: "#f8fafc",
  },
  date: {
    fontSize: 13,
    marginTop: 4,
  },
  handcuff: {
    marginLeft: 12,
  },
  lightDate: {
    color: "#64748b",
  },
  lightRow: {
    backgroundColor: "#ffffff",
    borderBottomColor: "#e2e8f0",
  },
  lightTitle: {
    color: "#0f172a",
  },
  pressed: {
    opacity: 0.65,
  },
  row: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
});
