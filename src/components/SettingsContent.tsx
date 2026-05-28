import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { ScreenFrame } from "./ScreenFrame";

export type AppSettings = {
  darkMode: boolean;
  dateFormat: "medium" | "iso";
};

type SettingsContextValue = {
  settings: AppSettings;
  setDarkMode: (enabled: boolean) => Promise<void>;
  setDateFormat: (dateFormat: AppSettings["dateFormat"]) => Promise<void>;
};

type SettingsContentProps = {
  onSetDarkMode: (enabled: boolean) => void;
  onSetDateFormat: (dateFormat: AppSettings["dateFormat"]) => void;
};

const SETTINGS_KEY = "criminal-intent:settings";
const defaultSettings: AppSettings = { darkMode: false, dateFormat: "medium" };
const SettingsContext = createContext<SettingsContextValue | null>(null);

async function getStoredSettings() {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  return raw ? { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) } : defaultSettings;
}

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    getStoredSettings().then(setSettings);
  }, []);

  const updateSettings = async (patch: Partial<AppSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      settings,
      setDarkMode: (enabled: boolean) => updateSettings({ darkMode: enabled }),
      setDateFormat: (dateFormat: AppSettings["dateFormat"]) => updateSettings({ dateFormat }),
    }),
    [settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const value = useContext(SettingsContext);

  if (!value) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return value;
}

export function SettingsContent({ onSetDarkMode, onSetDateFormat }: SettingsContentProps) {
  const { settings } = useSettings();
  const isDark = settings.darkMode;

  return (
    <ScreenFrame darkMode={isDark} showSettings={false} title="Settings">
      <View style={styles.content}>
        <View style={[styles.settingRow, isDark ? styles.darkCard : styles.lightCard]}>
          <View style={styles.settingText}>
            <Text style={[styles.label, isDark ? styles.darkLabel : styles.lightLabel]}>Dark Mode</Text>
            <Text style={[styles.description, isDark ? styles.darkDescription : styles.lightDescription]}>
              Use a darker background on app screens.
            </Text>
          </View>
          <Switch accessibilityLabel="Dark mode" onValueChange={onSetDarkMode} value={settings.darkMode} />
        </View>

        <View style={[styles.settingBlock, isDark ? styles.darkCard : styles.lightCard]}>
          <Text style={[styles.label, isDark ? styles.darkLabel : styles.lightLabel]}>Date Format</Text>
          <Pressable
            accessibilityLabel="Date format"
            accessibilityRole="button"
            onPress={() => undefined}
            style={[styles.segmentedControl, isDark ? styles.darkSegmentedControl : styles.lightSegmentedControl]}
          >
            <Pressable accessibilityRole="button" onPress={() => onSetDateFormat("medium")}>
              <Text
                style={[
                  styles.segment,
                  isDark ? styles.darkSegment : styles.lightSegment,
                  settings.dateFormat === "medium" && styles.activeSegment,
                ]}
              >
                Medium
              </Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => onSetDateFormat("iso")}>
              <Text
                style={[
                  styles.segment,
                  isDark ? styles.darkSegment : styles.lightSegment,
                  settings.dateFormat === "iso" && styles.activeSegment,
                ]}
              >
                ISO
              </Text>
            </Pressable>
          </Pressable>
        </View>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  activeSegment: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
  },
  content: {
    gap: 18,
    padding: 18,
  },
  darkCard: {
    backgroundColor: "#1f2937",
  },
  darkDescription: {
    color: "#cbd5e1",
  },
  darkLabel: {
    color: "#f8fafc",
  },
  darkSegment: {
    color: "#f8fafc",
  },
  darkSegmentedControl: {
    backgroundColor: "#111827",
  },
  description: {
    fontSize: 13,
    marginTop: 3,
  },
  label: {
    fontSize: 17,
    fontWeight: "800",
  },
  lightCard: {
    backgroundColor: "#ffffff",
  },
  lightDescription: {
    color: "#64748b",
  },
  lightLabel: {
    color: "#0f172a",
  },
  lightSegment: {
    color: "#0f172a",
  },
  lightSegmentedControl: {
    backgroundColor: "#e2e8f0",
  },
  segmentedControl: {
    alignSelf: "flex-start",
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 10,
    padding: 4,
  },
  segment: {
    borderRadius: 6,
    fontSize: 15,
    fontWeight: "700",
    minWidth: 88,
    paddingHorizontal: 14,
    paddingVertical: 9,
    textAlign: "center",
  },
  settingBlock: {
    borderRadius: 8,
    padding: 16,
  },
  settingRow: {
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  settingText: {
    flex: 1,
    paddingRight: 12,
  },
});
