import { router } from "expo-router";

import { CrimeFlatListScreen } from "@/components/CrimeListScreen";
import type { Crime } from "@/components/CrimeRow";
import { useCrimeList } from "@/hooks/useCrimeList";

export default function Index() {
  const { addCrime, crimes } = useCrimeList();

  return (
    <CrimeFlatListScreen
      crimes={crimes}
      onAddCrime={addCrime}
      onOpenCrime={(crime: Crime) => router.push({ pathname: "/crime/[id]", params: { id: crime.id } })}
    />
  );
}
