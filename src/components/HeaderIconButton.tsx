import { Pressable, StyleSheet, Text } from "react-native";

type HeaderIconButtonProps = {
  accessibilityLabel: string;
  icon: string;
  onPress: () => void;
};

export function HeaderIconButton({ accessibilityLabel, icon, onPress }: HeaderIconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.icon}>{icon}</Text>
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
  icon: {
    fontSize: 24,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.55,
  },
});
