import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatCrimeDate } from "@/lib/dateFormat";
import type { AppSettings, Crime } from "@/lib/types";

type CrimeRowProps = {
  crime: Crime;
  settings: AppSettings;
  onPress: () => void;
};

export function CrimeRow({ crime, settings, onPress }: CrimeRowProps) {
  const title = crime.title.trim() || "Untitled Crime";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{formatCrimeDate(crime.date, settings)}</Text>
      </View>
      {crime.solved ? (
        <Text accessibilityLabel={`${title} solved handcuff`} style={styles.handcuff}>
          ⛓
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  date: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 4,
  },
  handcuff: {
    color: "#334155",
    fontSize: 24,
    paddingLeft: 12,
  },
  pressed: {
    opacity: 0.65,
  },
  row: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomColor: "#e2e8f0",
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
    color: "#0f172a",
    fontSize: 17,
    fontWeight: "700",
  },
});
