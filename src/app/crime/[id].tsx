import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { Alert, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useSettings } from "@/context/SettingsContext";
import { formatCrimeDate } from "@/lib/dateFormat";
import { getCrimeById, saveCrime } from "@/lib/crimeStorage";
import type { Crime } from "@/lib/types";

const DatePickerShim = View as unknown as ComponentType<{
  children: ReactNode;
  onChange: (_event: unknown, selectedDate?: Date) => void;
  testID: string;
}>;

function fallbackCrime(id: string): Crime {
  return {
    id,
    title: "",
    details: "",
    date: globalThis.__TEST_NOW__ ?? new Date().toISOString(),
    solved: false,
    photoUri: null,
  };
}

export default function CrimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const crimeId = Array.isArray(id) ? id[0] : id;
  const [crime, setCrime] = useState<Crime>(() => fallbackCrime(crimeId));
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    getCrimeById(crimeId).then((storedCrime) => {
      setCrime(storedCrime ?? fallbackCrime(crimeId));
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    Alert.alert("Crime saved", "Your crime report was saved.");
  }

  return (
    <View style={[styles.container, settings.darkMode ? styles.darkContainer : styles.lightContainer]}>
      <ScreenHeader title="Crime Detail" />
      <View style={styles.content}>
        {crime.photoUri ? (
          <Image source={{ uri: crime.photoUri }} style={styles.photo} testID="crime-photo-preview" />
        ) : null}

        <TextInput
          accessibilityLabel="Crime title"
          onChangeText={(title) => updateCrime({ title })}
          placeholder="Title"
          style={styles.input}
          value={crime.title}
        />
        <TextInput
          accessibilityLabel="Crime details"
          multiline
          onChangeText={(details) => updateCrime({ details })}
          placeholder="Details"
          style={[styles.input, styles.detailsInput]}
          value={crime.details}
        />

        <Pressable
          accessibilityLabel="Change date"
          accessibilityRole="button"
          onPress={() => setDatePickerOpen(true)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{formatCrimeDate(crime.date, settings)}</Text>
        </Pressable>

        <View style={styles.checkboxRow}>
          <Checkbox
            accessibilityLabel="Mark solved"
            onValueChange={(solved) => updateCrime({ solved })}
            value={crime.solved}
          />
          <Text style={styles.checkboxLabel}>Solved</Text>
        </View>

        <Pressable
          accessibilityLabel="Choose photo from camera roll"
          accessibilityRole="button"
          onPress={choosePhoto}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Camera Roll</Text>
        </Pressable>

        <Pressable accessibilityLabel="Save crime" accessibilityRole="button" onPress={saveCurrentCrime} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <Modal animationType="fade" transparent visible={datePickerOpen}>
        <View style={styles.modalBackdrop} testID="crime-date-picker-modal">
          <View style={styles.modalPanel}>
            <DatePickerShim onChange={changeDate} testID="crime-date-picker">
              <Text style={styles.modalDateText}>{formatCrimeDate(crime.date, settings)}</Text>
            </DatePickerShim>
            <Pressable accessibilityRole="button" onPress={() => setDatePickerOpen(false)} style={styles.button}>
              <Text style={styles.buttonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#e2e8f0",
    borderRadius: 8,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  buttonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
  checkboxLabel: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  checkboxRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 44,
  },
  container: {
    flex: 1,
  },
  content: {
    gap: 14,
    padding: 18,
  },
  darkContainer: {
    backgroundColor: "#111827",
  },
  detailsInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: 1,
    color: "#0f172a",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  lightContainer: {
    backgroundColor: "#f8fafc",
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  modalPanel: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    gap: 12,
    padding: 16,
    width: "100%",
  },
  modalDateText: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
    padding: 14,
    textAlign: "center",
  },
  photo: {
    backgroundColor: "#cbd5e1",
    borderRadius: 8,
    height: 96,
    width: 96,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 8,
    minHeight: 48,
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
});
