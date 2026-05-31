import { router, Stack } from "expo-router";

import { CrimeDetailContent } from "@/components/CrimeDetailContent";
import { HeaderIconButton } from "@/components/HeaderIconButton";
import { useCrimeDetail } from "@/hooks/useCrimeDetail";

const headerButtonOffset = 34;

export default function CrimeDetailScreen() {
  const { changeDate, choosePhoto, crime, datePickerOpen, saveCurrentCrime, setDatePickerOpen, updateCrime } =
    useCrimeDetail();

  return (
    <>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerLeft: () => (
            <HeaderIconButton
              accessibilityLabel="Go back"
              icon="arrow-left"
              onPress={() => router.back()}
              style={{ marginTop: headerButtonOffset }}
            />
          ),
          headerRight: () => (
            <HeaderIconButton
              accessibilityLabel="Settings"
              icon="cog"
              onPress={() => router.push("/settings")}
              style={{ marginTop: headerButtonOffset }}
            />
          ),
          title: "Crime Detail",
        }}
      />
      <CrimeDetailContent
        crime={crime}
        datePickerOpen={datePickerOpen}
        onChangeDate={changeDate}
        onChoosePhoto={choosePhoto}
        onCloseDatePicker={() => setDatePickerOpen(false)}
        onOpenDatePicker={() => setDatePickerOpen(true)}
        onSaveCrime={saveCurrentCrime}
        onUpdateCrime={updateCrime}
      />
    </>
  );
}
