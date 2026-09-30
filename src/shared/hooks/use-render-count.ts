"use client";

import { useRef } from "react";

/**
 * Counts how many times the calling component has rendered. Debug-only
 * instrumentation for the performance case study in
 * src/features/hydro-monitor/README.md — not meant for production UI.
 */
// Intentional: this hook's entire purpose is counting renders for the debug
// UI, which requires reading/mutating a ref during render — safe here
// because nothing about this value's identity is meant to be memoized.
/* eslint-disable react-hooks/refs */
export function useRenderCount(): number {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}
/* eslint-enable react-hooks/refs */
