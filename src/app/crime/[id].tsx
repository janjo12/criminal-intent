import { CrimeDetailContent } from "@/components/CrimeDetailContent";
import { useCrimeDetail } from "@/hooks/useCrimeDetail";

export default function CrimeDetailScreen() {
  const { changeDate, choosePhoto, crime, datePickerOpen, saveCurrentCrime, setDatePickerOpen, updateCrime } =
    useCrimeDetail();

  return (
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
  );
}
