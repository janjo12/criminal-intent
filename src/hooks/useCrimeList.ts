import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { Crime } from "@/components/CrimeRow";

const CRIMES_KEY = "criminal-intent:crimes";

function createUuid() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      const value = Math.floor(Math.random() * 16);
      return (char === "x" ? value : (value & 0x3) | 0x8).toString(16);
    })
  );
}

function createEmptyCrime(): Crime {
  return {
    id: createUuid(),
    title: "",
    details: "",
    date: (globalThis as { __TEST_NOW__?: string }).__TEST_NOW__ ?? new Date().toISOString(),
    solved: false,
    photoUri: null,
  };
}

async function readCrimes() {
  const raw = await AsyncStorage.getItem(CRIMES_KEY);
  return raw ? (JSON.parse(raw) as Crime[]) : [];
}

async function saveCrime(crime: Crime) {
  const crimes = await readCrimes();
  const index = crimes.findIndex((item) => item.id === crime.id);
  await AsyncStorage.setItem(
    CRIMES_KEY,
    JSON.stringify(index >= 0 ? crimes.with(index, crime) : [...crimes, crime])
  );
}

function openCrime(crime: Crime) {
  router.push({ pathname: "/crime/[id]", params: { id: crime.id } });
}

export function useCrimeList() {
  const [crimes, setCrimes] = useState<Crime[]>([]);

  const refreshCrimes = useCallback(async () => {
    setCrimes(await readCrimes());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshCrimes();
    }, [refreshCrimes])
  );

  async function addCrime() {
    const crime = createEmptyCrime();
    await saveCrime(crime);
    openCrime(crime);
  }

  return {
    addCrime,
    crimes,
  };
}
