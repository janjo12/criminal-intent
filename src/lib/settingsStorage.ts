import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AppSettings } from "./types";

export const SETTINGS_KEY = "criminal-intent:settings";

export const defaultSettings: AppSettings = {
  darkMode: false,
  dateFormat: "medium",
};

export async function loadSettings() {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  return raw ? { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) } : defaultSettings;
}

export async function saveSettings(settings: AppSettings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}
