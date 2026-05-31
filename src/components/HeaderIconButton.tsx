import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import type { ComponentProps } from "react";
import type { StyleProp, ViewStyle } from "react-native";

type HeaderIconButtonProps = {
  accessibilityLabel: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function HeaderIconButton({ accessibilityLabel, icon, onPress, style }: HeaderIconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons color={theme.colors.primary} name={icon} size={26} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  pressed: {
    opacity: 0.55,
  },
});
