import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import type { Crime } from "@/components/CrimeRow";

const CRIMES_KEY = "criminal-intent:crimes";

function fallbackCrime(id: string): Crime {
  return {
    id,
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

export function useCrimeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const crimeId = Array.isArray(id) ? id[0] : id;
  const [crime, setCrime] = useState<Crime>(() => fallbackCrime(crimeId));
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    readCrimes().then((crimes) => {
      setCrime(crimes.find((storedCrime) => storedCrime.id === crimeId) ?? fallbackCrime(crimeId));
    });
  }, [crimeId]);

  const updateCrime = useCallback((patch: Partial<Crime>) => {
    setCrime((current) => ({ ...current, ...patch }));
  }, []);

  async function choosePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Photo access needed", "Allow photo library access to attach evidence.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ["images"],
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      updateCrime({ photoUri: result.assets[0].uri });
    }
  }

  function changeDate(_event: unknown, selectedDate?: Date) {
    if (selectedDate) {
      updateCrime({ date: selectedDate.toISOString() });
      setDatePickerOpen(false);
    }
  }

  async function saveCurrentCrime() {
    await saveCrime(crime);
    router.replace("/");
  }

  return {
    changeDate,
    choosePhoto,
    crime,
    datePickerOpen,
    saveCurrentCrime,
    setDatePickerOpen,
    updateCrime,
  };
}
