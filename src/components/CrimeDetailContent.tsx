import Checkbox from "expo-checkbox";
import type { ComponentType, ReactNode } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenFrame } from "./ScreenFrame";
import { useSettings } from "./SettingsContent";

import type { Crime } from "./CrimeRow";

const DatePickerShim = View as unknown as ComponentType<{
  children: ReactNode;
  onChange: (_event: unknown, selectedDate?: Date) => void;
  testID: string;
}>;

function formatCrimeDate(value: string, dateFormat: "medium" | "iso") {
  const date = new Date(value);
  return dateFormat === "iso"
    ? date.toISOString().slice(0, 10)
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type CrimeDetailContentProps = {
  crime: Crime;
  datePickerOpen: boolean;
  onChangeDate: (_event: unknown, selectedDate?: Date) => void;
  onChoosePhoto: () => void;
  onCloseDatePicker: () => void;
  onOpenDatePicker: () => void;
  onSaveCrime: () => void;
  onUpdateCrime: (patch: Partial<Crime>) => void;
};

export function CrimeDetailContent({
  crime,
  datePickerOpen,
  onChangeDate,
  onChoosePhoto,
  onCloseDatePicker,
  onOpenDatePicker,
  onSaveCrime,
  onUpdateCrime,
}: CrimeDetailContentProps) {
  const { settings } = useSettings();
  const isDark = settings.darkMode;

  return (
    <ScreenFrame darkMode={isDark} title="Crime Detail">
      <View style={styles.content}>
        {crime.photoUri ? (
          <Image source={{ uri: crime.photoUri }} style={styles.photo} testID="crime-photo-preview" />
        ) : null}

        <TextInput
          accessibilityLabel="Crime title"
          onChangeText={(title) => onUpdateCrime({ title })}
          placeholder="Title"
          placeholderTextColor={isDark ? "#94a3b8" : "#64748b"}
          style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
          value={crime.title}
        />
        <TextInput
          accessibilityLabel="Crime details"
          multiline
          onChangeText={(details) => onUpdateCrime({ details })}
          placeholder="Details"
          placeholderTextColor={isDark ? "#94a3b8" : "#64748b"}
          style={[styles.input, styles.detailsInput, isDark ? styles.darkInput : styles.lightInput]}
          value={crime.details}
        />

        <Pressable
          accessibilityLabel="Change date"
          accessibilityRole="button"
          onPress={onOpenDatePicker}
          style={[styles.button, isDark ? styles.darkButton : styles.lightButton]}
        >
          <Text style={[styles.buttonText, isDark ? styles.darkButtonText : styles.lightButtonText]}>
            {formatCrimeDate(crime.date, settings.dateFormat)}
          </Text>
        </Pressable>

        <View style={styles.checkboxRow}>
          <Checkbox
            accessibilityLabel="Mark solved"
            onValueChange={(solved) => onUpdateCrime({ solved })}
            value={crime.solved}
          />
          <Text style={[styles.checkboxLabel, isDark ? styles.darkLabel : styles.lightLabel]}>Solved</Text>
        </View>

        <Pressable
          accessibilityLabel="Choose photo from camera roll"
          accessibilityRole="button"
          onPress={onChoosePhoto}
          style={[styles.button, isDark ? styles.darkButton : styles.lightButton]}
        >
          <Text style={[styles.buttonText, isDark ? styles.darkButtonText : styles.lightButtonText]}>Camera Roll</Text>
        </Pressable>

        <Pressable accessibilityLabel="Save crime" accessibilityRole="button" onPress={onSaveCrime} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <Modal animationType="fade" transparent visible={datePickerOpen} onRequestClose={onCloseDatePicker}>
        <View style={styles.modalBackdrop} testID="crime-date-picker-modal">
          <View style={[styles.modalPanel, isDark ? styles.darkModalPanel : styles.lightModalPanel]}>
            <DatePickerShim onChange={onChangeDate} testID="crime-date-picker">
              <Text style={[styles.modalDateText, isDark ? styles.darkLabel : styles.lightLabel]}>
                {formatCrimeDate(crime.date, settings.dateFormat)}
              </Text>
            </DatePickerShim>
            <Pressable
              accessibilityRole="button"
              onPress={onCloseDatePicker}
              style={[styles.button, isDark ? styles.darkButton : styles.lightButton]}
            >
              <Text style={[styles.buttonText, isDark ? styles.darkButtonText : styles.lightButtonText]}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 8,
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  checkboxRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 44,
  },
  content: {
    gap: 14,
    padding: 18,
  },
  darkButton: {
    backgroundColor: "#334155",
  },
  darkButtonText: {
    color: "#f8fafc",
  },
  darkInput: {
    backgroundColor: "#1f2937",
    borderColor: "#475569",
    color: "#f8fafc",
  },
  darkLabel: {
    color: "#f8fafc",
  },
  darkModalPanel: {
    backgroundColor: "#1f2937",
  },
  detailsInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  lightButton: {
    backgroundColor: "#e2e8f0",
  },
  lightButtonText: {
    color: "#0f172a",
  },
  lightInput: {
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    color: "#0f172a",
  },
  lightLabel: {
    color: "#0f172a",
  },
  lightModalPanel: {
    backgroundColor: "#ffffff",
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  modalPanel: {
    borderRadius: 8,
    gap: 12,
    padding: 16,
    width: "100%",
  },
  modalDateText: {
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
