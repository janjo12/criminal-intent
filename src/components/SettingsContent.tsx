import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

  if (!raw) {
    return defaultSettings;
  }

  try {
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch (error) {
    console.warn("Unable to parse stored settings.", error);
    return defaultSettings;
  }
}

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    getStoredSettings()
      .then(setSettings)
      .catch((error) => {
        console.warn("Unable to load stored settings.", error);
      })
      .finally(() => {
        setIsHydrated(true);
      });
  }, []);

  const updateSettings = useCallback(async (patch: Partial<AppSettings>) => {
    let previousSettings = defaultSettings;
    let nextSettings = defaultSettings;

    setSettings((currentSettings) => {
      previousSettings = currentSettings;
      nextSettings = { ...currentSettings, ...patch };
      return nextSettings;
    });

    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
    } catch (error) {
      console.warn("Unable to save settings.", error);
      setSettings((currentSettings) => (currentSettings === nextSettings ? previousSettings : currentSettings));
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({
      settings,
      setDarkMode: (enabled: boolean) => updateSettings({ darkMode: enabled }),
      setDateFormat: (dateFormat: AppSettings["dateFormat"]) => updateSettings({ dateFormat }),
    }),
    [settings, updateSettings]
  );

  if (!isHydrated) {
    return null;
  }

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
          <View
            accessible
            accessibilityLabel="Date format"
            style={[styles.segmentedControl, isDark ? styles.darkSegmentedControl : styles.lightSegmentedControl]}
          >
            <Pressable
              accessibilityLabel="Medium"
              accessibilityRole="button"
              onPress={() => onSetDateFormat("medium")}
              style={[styles.segmentButton, settings.dateFormat === "medium" && styles.activeSegmentButton]}
            >
              <Text
                style={[
                  styles.segmentText,
                  isDark ? styles.darkSegmentText : styles.lightSegmentText,
                  settings.dateFormat === "medium" && styles.activeSegmentText,
                ]}
              >
                Medium
              </Text>
            </Pressable>
            <Pressable
              accessibilityLabel="ISO"
              accessibilityRole="button"
              onPress={() => onSetDateFormat("iso")}
              style={[styles.segmentButton, settings.dateFormat === "iso" && styles.activeSegmentButton]}
            >
              <Text
                style={[
                  styles.segmentText,
                  isDark ? styles.darkSegmentText : styles.lightSegmentText,
                  settings.dateFormat === "iso" && styles.activeSegmentText,
                ]}
              >
                ISO
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  activeSegmentButton: {
    backgroundColor: "#2563eb",
  },
  activeSegmentText: {
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
  darkSegmentText: {
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
  lightSegmentText: {
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
  segmentButton: {
    borderRadius: 6,
    minWidth: 88,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "700",
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
