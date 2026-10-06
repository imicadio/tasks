"use client";

import { useEffect, useState } from "react";
import { ThemeIcon } from "./theme-icon";
import { useTheme } from "next-themes";
import { Button } from "@/shared/ui/button";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid a hydration mismatch: resolvedTheme is only known client-side.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const handleToggle = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Przełącz motyw"
      onClick={handleToggle}
    >
      <ThemeIcon dark={mounted && resolvedTheme === "dark"} />
    </Button>
  );
};
