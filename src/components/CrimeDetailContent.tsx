import Checkbox from "expo-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenFrame } from "./ScreenFrame";
import { useSettings } from "./SettingsContent";

import type { Crime } from "./CrimeRow";

const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

function formatCrimeDate(value: string, dateFormat: "medium" | "iso") {
  const date = new Date(value);
  return dateFormat === "iso"
    ? date.toISOString().slice(0, 10)
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getMonthDays(displayDate: Date) {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<number | null> = Array.from({ length: firstDay }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

function isSameDate(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function toDayDate(displayDate: Date, day: number) {
  return new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
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
  const crimeDate = useMemo(() => new Date(crime.date), [crime.date]);
  const [calendarDate, setCalendarDate] = useState(crimeDate);
  const [pendingDate, setPendingDate] = useState(crimeDate);
  const calendarDays = useMemo(() => getMonthDays(calendarDate), [calendarDate]);
  const calendarMonth = calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const pendingHeader = pendingDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  useEffect(() => {
    if (datePickerOpen) {
      setCalendarDate(crimeDate);
      setPendingDate(crimeDate);
    }
  }, [crimeDate, datePickerOpen]);

  function changeCalendarMonth(offset: number) {
    setCalendarDate((currentDate) => new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  }

  function confirmDate() {
    onChangeDate({}, pendingDate);
  }

  return (
    <ScreenFrame darkMode={isDark} title="Crime Detail">
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

      <Modal animationType="fade" transparent visible={datePickerOpen} onRequestClose={onCloseDatePicker}>
        <View style={styles.modalBackdrop} testID="crime-date-picker-modal">
          <View style={styles.calendarPanel}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarYear}>{pendingDate.getFullYear()}</Text>
              <Text style={styles.calendarSelectedDate}>{pendingHeader}</Text>
            </View>
            <View style={styles.calendarBody}>
              <View style={styles.calendarMonthRow}>
                <Pressable accessibilityLabel="Previous month" accessibilityRole="button" onPress={() => changeCalendarMonth(-1)}>
                  <MaterialCommunityIcons color="#1f2937" name="chevron-left" size={34} />
                </Pressable>
                <Text style={styles.calendarMonth}>{calendarMonth}</Text>
                <Pressable accessibilityLabel="Next month" accessibilityRole="button" onPress={() => changeCalendarMonth(1)}>
                  <MaterialCommunityIcons color="#1f2937" name="chevron-right" size={34} />
                </Pressable>
              </View>
              <View style={styles.weekRow}>
                {dayLabels.map((dayLabel, index) => (
                  <Text key={`${dayLabel}-${index}`} style={styles.weekday}>
                    {dayLabel}
                  </Text>
                ))}
              </View>
              <View style={styles.calendarGrid} testID="crime-date-picker">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <View key={`empty-${index}`} style={styles.calendarDay} />;
                  }

                  const dayDate = toDayDate(calendarDate, day);
                  const isSelected = isSameDate(dayDate, pendingDate);

                  return (
                    <Pressable
                      accessibilityLabel={`Select ${dayDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}`}
                      accessibilityRole="button"
                      key={dayDate.toISOString()}
                      onPress={() => setPendingDate(dayDate)}
                      style={[styles.calendarDay, isSelected && styles.selectedCalendarDay]}
                    >
                      <Text style={[styles.calendarDayText, isSelected && styles.selectedCalendarDayText]}>{day}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.calendarActions}>
                <Pressable accessibilityRole="button" onPress={onCloseDatePicker} style={styles.calendarAction}>
                  <Text style={styles.calendarActionText}>Cancel</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={confirmDate} style={styles.calendarAction}>
                  <Text style={styles.calendarActionText}>OK</Text>
                </Pressable>
              </View>
            </View>
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
  calendarAction: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  calendarActions: {
    flexDirection: "row",
    gap: 36,
    justifyContent: "flex-end",
    marginTop: 28,
  },
  calendarActionText: {
    color: "#1f7fba",
    fontSize: 16,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  calendarBody: {
    backgroundColor: "#ffffff",
    padding: 22,
  },
  calendarDay: {
    alignItems: "center",
    height: 46,
    justifyContent: "center",
    width: `${100 / 7}%`,
  },
  calendarDayText: {
    color: "#1f2937",
    fontSize: 17,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  calendarHeader: {
    backgroundColor: "#2384bd",
    paddingHorizontal: 26,
    paddingVertical: 24,
  },
  calendarMonth: {
    color: "#1f2937",
    flex: 1,
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
  },
  calendarMonthRow: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 20,
  },
  calendarPanel: {
    borderRadius: 8,
    maxWidth: 640,
    overflow: "hidden",
    width: "76%",
  },
  calendarSelectedDate: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "500",
    marginTop: 8,
  },
  calendarYear: {
    color: "#bfdbfe",
    fontSize: 20,
    fontWeight: "800",
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
  darkModalPanel: {
    backgroundColor: "#1f2937",
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
  lightModalPanel: {
    backgroundColor: "#ffffff",
  },
  lightPhotoFrame: {
    backgroundColor: "#e2e8f0",
  },
  lightUnderlineInput: {
    borderBottomColor: "#cbd5e1",
    color: "#0f172a",
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
  selectedCalendarDay: {
    backgroundColor: "#2384bd",
    borderRadius: 23,
  },
  selectedCalendarDayText: {
    color: "#ffffff",
    fontWeight: "700",
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
  weekRow: {
    flexDirection: "row",
  },
  weekday: {
    color: "#64748b",
    fontSize: 16,
    textAlign: "center",
    width: `${100 / 7}%`,
  },
});
