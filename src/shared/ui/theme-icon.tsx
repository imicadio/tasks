import { Moon, Sun } from "lucide-react";

type Props = { dark: boolean };

/** The icon for the theme you'd switch to: a sun in dark mode, a moon in light. */
export const ThemeIcon = ({ dark }: Props) => {
  if (dark) return <Sun className="size-4" />;
  return <Moon className="size-4" />;
};
