import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { defaultSettings, loadSettings, saveSettings } from "@/lib/settingsStorage";
import type { AppSettings } from "@/lib/types";

type SettingsContextValue = {
  settings: AppSettings;
  setDarkMode: (enabled: boolean) => Promise<void>;
  setDateFormat: (dateFormat: AppSettings["dateFormat"]) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      async setDarkMode(enabled) {
        const next = { ...settings, darkMode: enabled };
        setSettings(next);
        await saveSettings(next);
      },
      async setDateFormat(dateFormat) {
        const next = { ...settings, dateFormat };
        setSettings(next);
        await saveSettings(next);
      },
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
