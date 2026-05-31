import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import { createCrime, readCrimes, saveCrime } from "@/models/crime";
import type { Crime } from "@/models/crime";

export function useCrimeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const crimeId = Array.isArray(id) ? id[0] : id;
  const [crime, setCrime] = useState<Crime>(() => createCrime(crimeId));
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    readCrimes().then((crimes) => {
      setCrime(crimes.find((storedCrime) => storedCrime.id === crimeId) ?? createCrime(crimeId));
    });
  }, [crimeId]);

  function updateCrime(patch: Partial<Crime>) {
    setCrime((current) => ({ ...current, ...patch }));
  }

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

  function changeDate(selectedDate: Date) {
    updateCrime({ date: selectedDate.toISOString() });
    setDatePickerOpen(false);
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
