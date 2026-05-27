import type { AppSettings } from "./types";

export function formatCrimeDate(value: string, settings: AppSettings) {
  const date = new Date(value);

  if (settings.dateFormat === "iso") {
    return date.toISOString().slice(0, 10);
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
