import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const CRIMES_KEY = "criminal-intent:crimes";

export type Crime = {
  id: string;
  title: string;
  details: string;
  date: string;
  solved: boolean;
  photoUri?: string | null;
};

export function createCrime(id = Crypto.randomUUID()): Crime {
  return {
    id,
    title: "",
    details: "",
    date: (globalThis as { __TEST_NOW__?: string }).__TEST_NOW__ ?? new Date().toISOString(),
    solved: false,
    photoUri: null,
  };
}

export function formatCrimeDate(value: string, dateFormat: "medium" | "iso") {
  const date = new Date(value);
  return dateFormat === "iso"
    ? date.toISOString().slice(0, 10)
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export async function readCrimes() {
  const raw = await AsyncStorage.getItem(CRIMES_KEY);
  return raw ? (JSON.parse(raw) as Crime[]) : [];
}

export async function saveCrime(crime: Crime) {
  const crimes = await readCrimes();
  const index = crimes.findIndex((item) => item.id === crime.id);
  await AsyncStorage.setItem(CRIMES_KEY, JSON.stringify(index >= 0 ? crimes.with(index, crime) : [...crimes, crime]));
}
