import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { HeaderIconButton } from "./HeaderIconButton";

type ScreenHeaderProps = {
  title: string;
  showAdd?: boolean;
  showSettings?: boolean;
  onAdd?: () => void;
};

export function ScreenHeader({ title, showAdd, showSettings = true, onAdd }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        {showAdd && onAdd ? <HeaderIconButton accessibilityLabel="Add crime" icon="+" onPress={onAdd} /> : null}
        {showSettings ? (
          <HeaderIconButton accessibilityLabel="Settings" icon="⚙" onPress={() => router.push("/settings")} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 6,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderBottomColor: "#dbe4ee",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 64,
    paddingHorizontal: 16,
  },
  title: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "800",
  },
});
