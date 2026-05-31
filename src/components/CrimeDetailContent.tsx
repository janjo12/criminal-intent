import Checkbox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenFrame } from "./ScreenFrame";
import { useSettings } from "./SettingsContent";

import { formatCrimeDate } from "@/models/crime";
import type { Crime } from "@/models/crime";

type CrimeDetailContentProps = {
  crime: Crime;
  datePickerOpen: boolean;
  onChangeDate: (selectedDate: Date) => void;
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
    <ScreenFrame darkMode={isDark}>
      <View style={styles.content}>
        <View style={styles.heroRow}>
          <View style={styles.photoColumn}>
            <View style={[styles.photoFrame, isDark ? styles.darkPhotoFrame : styles.lightPhotoFrame]}>
              {crime.photoUri ? (
                <Image source={{ uri: crime.photoUri }} style={styles.photo} testID="crime-photo-preview" />
              ) : null}
            </View>
            <Pressable
              accessibilityLabel="Choose photo from camera roll"
              accessibilityRole="button"
              onPress={onChoosePhoto}
              style={({ pressed }) => [
                styles.cameraButton,
                isDark ? styles.darkCameraButton : styles.lightCameraButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons color={isDark ? "#f8fafc" : "#0f172a"} name="camera" size={30} />
            </Pressable>
          </View>

          <View style={styles.titleColumn}>
            <Text style={[styles.sectionLabel, isDark ? styles.darkLabel : styles.lightLabel]}>Title</Text>
            <TextInput
              accessibilityLabel="Crime title"
              onChangeText={(title) => onUpdateCrime({ title })}
              placeholder="Title"
              placeholderTextColor={isDark ? "#94a3b8" : "#64748b"}
              style={[styles.titleInput, isDark ? styles.darkUnderlineInput : styles.lightUnderlineInput]}
              value={crime.title}
            />
          </View>
        </View>

        <Text style={[styles.sectionLabel, isDark ? styles.darkLabel : styles.lightLabel]}>Details</Text>
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

        {datePickerOpen ? (
          <DateTimePicker
            accessibilityLabel="Crime date picker"
            display="default"
            mode="date"
            onDismiss={onCloseDatePicker}
            onValueChange={(_event, selectedDate) => onChangeDate(selectedDate)}
            testID="crime-date-picker"
            value={new Date(crime.date)}
          />
        ) : null}

        <View style={styles.checkboxRow}>
          <Checkbox
            accessibilityLabel="Mark solved"
            onValueChange={(solved) => onUpdateCrime({ solved })}
            value={crime.solved}
          />
          <Text style={[styles.checkboxLabel, isDark ? styles.darkLabel : styles.lightLabel]}>Solved</Text>
        </View>

        <Pressable accessibilityLabel="Save crime" accessibilityRole="button" onPress={onSaveCrime} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
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
  cameraButton: {
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8,
    height: 58,
    justifyContent: "center",
    marginTop: 12,
    width: 120,
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
    gap: 16,
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
  darkCameraButton: {
    backgroundColor: "#334155",
  },
  darkPhotoFrame: {
    backgroundColor: "#334155",
  },
  darkUnderlineInput: {
    borderBottomColor: "#475569",
    color: "#f8fafc",
  },
  detailsInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  heroRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 18,
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
  lightCameraButton: {
    backgroundColor: "#e2e8f0",
  },
  lightPhotoFrame: {
    backgroundColor: "#e2e8f0",
  },
  lightUnderlineInput: {
    borderBottomColor: "#cbd5e1",
    color: "#0f172a",
  },
  photo: {
    height: "100%",
    width: "100%",
  },
  photoColumn: {
    width: 124,
  },
  photoFrame: {
    height: 124,
    overflow: "hidden",
    width: 124,
  },
  pressed: {
    opacity: 0.65,
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
  sectionLabel: {
    fontSize: 22,
    fontWeight: "800",
  },
  titleColumn: {
    flex: 1,
  },
  titleInput: {
    borderBottomWidth: 1,
    fontSize: 18,
    minHeight: 46,
    paddingVertical: 8,
  },
});
