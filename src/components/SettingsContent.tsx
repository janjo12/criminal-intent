import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Appearance, Pressable, StyleSheet, Switch, Text, useColorScheme, View } from "react-native";

import { ScreenFrame } from "./ScreenFrame";

export type AppSettings = {
  darkMode: boolean;
  dateFormat: "medium" | "iso";
};

type SettingsValue = {
  isHydrated: boolean;
  settings: AppSettings;
  setDarkMode: (enabled: boolean) => Promise<void>;
  setDateFormat: (dateFormat: AppSettings["dateFormat"]) => Promise<void>;
};

const SETTINGS_KEY = "criminal-intent:settings";
const getDefaultSettings = (darkMode: boolean): AppSettings => ({ darkMode, dateFormat: "medium" });
let cachedSettings: AppSettings | null = null;
const settingsListeners = new Set<(settings: AppSettings) => void>();

function broadcastSettings(settings: AppSettings) {
  cachedSettings = settings;
  settingsListeners.forEach((listener) => listener(settings));
}

async function getStoredSettings(defaultSettings: AppSettings) {
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

export function useSettings(): SettingsValue {
  const systemColorScheme = useColorScheme();
  const [defaultSettings] = useState(() => getDefaultSettings(systemColorScheme === "dark"));
  const [settings, setSettings] = useState(cachedSettings ?? defaultSettings);
  const [isHydrated, setIsHydrated] = useState(cachedSettings !== null);

  useEffect(() => {
    let isMounted = true;

    getStoredSettings(defaultSettings)
      .then((storedSettings) => {
        cachedSettings = storedSettings;
        if (isMounted) {
          setSettings(storedSettings);
        }
      })
      .catch((error) => {
        console.warn("Unable to load stored settings.", error);
        cachedSettings = defaultSettings;
      })
      .finally(() => {
        if (isMounted) {
          setIsHydrated(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [defaultSettings]);

  useEffect(() => {
    Appearance.setColorScheme(settings.darkMode ? "dark" : "light");
  }, [settings.darkMode]);

  useEffect(() => {
    const listener = (nextSettings: AppSettings) => {
      setSettings(nextSettings);
      setIsHydrated(true);
    };

    settingsListeners.add(listener);

    return () => {
      settingsListeners.delete(listener);
    };
  }, []);

  async function updateSettings(patch: Partial<AppSettings>) {
    const previousSettings = settings;
    const nextSettings = { ...settings, ...patch };

    setSettings(nextSettings);
    broadcastSettings(nextSettings);

    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
    } catch (error) {
      console.warn("Unable to save settings.", error);
      setSettings((currentSettings) => (currentSettings === nextSettings ? previousSettings : currentSettings));
      broadcastSettings(previousSettings);
      throw error;
    }
  }

  return {
    isHydrated,
    settings,
    setDarkMode: (enabled) => updateSettings({ darkMode: enabled }),
    setDateFormat: (dateFormat) => updateSettings({ dateFormat }),
  };
}

export function SettingsContent() {
  const { setDarkMode, setDateFormat, settings } = useSettings();
  const isDark = settings.darkMode;

  return (
    <ScreenFrame darkMode={isDark}>
      <View style={styles.content}>
        <View style={[styles.settingRow, isDark ? styles.darkCard : styles.lightCard]}>
          <View style={styles.settingText}>
            <Text style={[styles.label, isDark ? styles.darkLabel : styles.lightLabel]}>Dark Mode</Text>
            <Text style={[styles.description, isDark ? styles.darkDescription : styles.lightDescription]}>
              Use a darker background on app screens.
            </Text>
          </View>
          <Switch accessibilityLabel="Dark mode" onValueChange={setDarkMode} value={settings.darkMode} />
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
              onPress={() => setDateFormat("medium")}
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
              onPress={() => setDateFormat("iso")}
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
