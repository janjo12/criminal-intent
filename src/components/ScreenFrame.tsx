import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

type ScreenFrameProps = PropsWithChildren<{
  accessibilityLabel?: string;
  darkMode: boolean;
  testID?: string;
}>;

export function ScreenFrame({ accessibilityLabel, children, darkMode, testID }: ScreenFrameProps) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}
      testID={testID}
    >
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
