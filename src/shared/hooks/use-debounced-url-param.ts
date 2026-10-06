"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useDebouncedValue } from "./use-debounced-value";
import { useUrlState } from "./use-url-state";

/**
 * A search box backed by one URL param: the input updates instantly, the
 * URL (and anything querying from it) only after the user stops typing for
 * `delayMs`.
 */
export function useDebouncedUrlParam(key: string, initial: string, delayMs: number) {
  const [input, setInput] = useState(initial);
  const [value, setValue] = useUrlState(key, initial);

  const debounced = useDebouncedValue(input, delayMs);
  useEffect(() => {
    if (debounced !== value) setValue(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the URL setter should react to the debounced value
  }, [debounced]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    setInput(event.target.value);

  return { input, value, handleInputChange };
}
