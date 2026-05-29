import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeaderIconButton } from "./HeaderIconButton";

const EXPO_GO_TOP_OFFSET = 28;

type ScreenHeaderProps = {
  darkMode: boolean;
  title: string;
  showAdd?: boolean;
  showBack?: boolean;
  showSettings?: boolean;
  onAdd?: () => void;
};

export function ScreenHeader({ darkMode, title, showAdd, showBack = true, showSettings = true, onAdd }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        darkMode ? styles.darkHeader : styles.lightHeader,
        { paddingTop: insets.top + EXPO_GO_TOP_OFFSET },
      ]}
    >
      <View style={styles.leftActions}>
        {showBack ? (
          <HeaderIconButton accessibilityLabel="Go back" darkMode={darkMode} icon="<" onPress={() => router.back()} />
        ) : null}
      </View>
      <Text numberOfLines={1} style={[styles.title, darkMode ? styles.darkTitle : styles.lightTitle]}>
        {title}
      </Text>
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
    justifyContent: "flex-end",
    minWidth: 86,
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
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  leftActions: {
    minWidth: 86,
  },
  lightHeader: {
    backgroundColor: "#f8fafc",
    borderBottomColor: "#dbe4ee",
  },
  lightTitle: {
    color: "#0f172a",
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
});
