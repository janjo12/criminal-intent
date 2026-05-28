import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { HeaderIconButton } from "./HeaderIconButton";

type ScreenHeaderProps = {
  darkMode: boolean;
  title: string;
  showAdd?: boolean;
  showSettings?: boolean;
  onAdd?: () => void;
};

export function ScreenHeader({ darkMode, title, showAdd, showSettings = true, onAdd }: ScreenHeaderProps) {
  return (
    <View style={[styles.header, darkMode ? styles.darkHeader : styles.lightHeader]}>
      <Text style={[styles.title, darkMode ? styles.darkTitle : styles.lightTitle]}>{title}</Text>
      <View style={styles.actions}>
        {showAdd && onAdd ? (
          <HeaderIconButton accessibilityLabel="Add crime" darkMode={darkMode} icon="+" onPress={onAdd} />
        ) : null}
        {showSettings ? (
          <HeaderIconButton accessibilityLabel="Settings" darkMode={darkMode} icon="⚙" onPress={() => router.push("/settings")} />
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
  darkHeader: {
    backgroundColor: "#111827",
    borderBottomColor: "#334155",
  },
  darkTitle: {
    color: "#f8fafc",
  },
  header: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 64,
    paddingHorizontal: 16,
  },
  lightHeader: {
    backgroundColor: "#f8fafc",
    borderBottomColor: "#dbe4ee",
  },
  lightTitle: {
    color: "#0f172a",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
});
