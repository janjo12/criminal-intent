import { SettingsContent, useSettings } from "@/components/SettingsContent";

export default function SettingsScreen() {
  const { setDarkMode, setDateFormat } = useSettings();

  return <SettingsContent onSetDarkMode={setDarkMode} onSetDateFormat={setDateFormat} />;
}
