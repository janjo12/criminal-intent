import { Pressable, StyleSheet, Text } from "react-native";

type HeaderIconButtonProps = {
  accessibilityLabel: string;
  darkMode?: boolean;
  icon: string;
  onPress: () => void;
};

export function HeaderIconButton({ accessibilityLabel, darkMode = false, icon, onPress }: HeaderIconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, darkMode ? styles.darkButton : styles.lightButton, pressed && styles.pressed]}
    >
      <Text style={[styles.icon, darkMode ? styles.darkIcon : styles.lightIcon]}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  darkButton: {
    backgroundColor: "#1f2937",
  },
  darkIcon: {
    color: "#f8fafc",
  },
  icon: {
    fontSize: 24,
    fontWeight: "700",
  },
  lightButton: {
    backgroundColor: "#e2e8f0",
  },
  lightIcon: {
    color: "#0f172a",
  },
  pressed: {
    opacity: 0.55,
  },
});
