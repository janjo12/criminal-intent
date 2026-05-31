import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { createCrime, readCrimes } from "@/models/crime";
import type { Crime } from "@/models/crime";

function openCrime(crime: Crime) {
  router.push({ pathname: "/crime/[id]", params: { id: crime.id } });
}

export function useCrimeList() {
  const [crimes, setCrimes] = useState<Crime[]>([]);

  useFocusEffect(
    useCallback(() => {
      readCrimes().then(setCrimes);
    }, [])
  );

  function addCrime() {
    openCrime(createCrime());
  }

  return {
    addCrime,
    crimes,
  };
}
