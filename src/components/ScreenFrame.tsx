import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { ScreenHeader } from "./ScreenHeader";

type ScreenFrameProps = PropsWithChildren<{
  accessibilityLabel?: string;
  darkMode: boolean;
  onAdd?: () => void;
  showAdd?: boolean;
  showSettings?: boolean;
  testID?: string;
  title: string;
}>;

export function ScreenFrame({
  accessibilityLabel,
  children,
  darkMode,
  onAdd,
  showAdd,
  showSettings,
  testID,
  title,
}: ScreenFrameProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}
      testID={testID}
    >
      <ScreenHeader darkMode={darkMode} title={title} showAdd={showAdd} showSettings={showSettings} onAdd={onAdd} />
      {children}
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
  lightContainer: {
    backgroundColor: "#f8fafc",
  },
});
