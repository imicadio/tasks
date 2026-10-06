"use client";

import { useEffect, useState } from "react";
import { useIncidentReportStore } from "../store";

/** The store skips automatic hydration (see store.ts): read localStorage
 * only after mount so the server and first client render agree. True once
 * the persisted draft and reports are loaded. */
export function useStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    void Promise.resolve(useIncidentReportStore.persist.rehydrate()).then(() =>
      setHydrated(true),
    );
  }, []);

  return hydrated;
}
