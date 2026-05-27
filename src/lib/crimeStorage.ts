import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Crime } from "./types";

export const CRIMES_KEY = "criminal-intent:crimes";

function createUuid() {
  const randomUuid = globalThis.crypto?.randomUUID?.();

  if (randomUuid) {
    return randomUuid;
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const value = Math.floor(Math.random() * 16);
    const nibble = char === "x" ? value : (value & 0x3) | 0x8;
    return nibble.toString(16);
  });
}

async function readCrimes() {
  const raw = await AsyncStorage.getItem(CRIMES_KEY);
  return raw ? (JSON.parse(raw) as Crime[]) : [];
}

async function writeCrimes(crimes: Crime[]) {
  await AsyncStorage.setItem(CRIMES_KEY, JSON.stringify(crimes));
}

export async function listCrimes() {
  return readCrimes();
}

export async function getCrimeById(id: string) {
  const crimes = await readCrimes();
  return crimes.find((crime) => crime.id === id) ?? null;
}

export async function saveCrime(crime: Crime) {
  const crimes = await readCrimes();
  const index = crimes.findIndex((item) => item.id === crime.id);

  if (index >= 0) {
    crimes[index] = crime;
  } else {
    crimes.push(crime);
  }

  await writeCrimes(crimes);
  return crime;
}

export async function createEmptyCrime() {
  const crime: Crime = {
    id: createUuid(),
    title: "",
    details: "",
    date: globalThis.__TEST_NOW__ ?? new Date().toISOString(),
    solved: false,
    photoUri: null,
  };

  return crime;
}
