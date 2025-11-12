"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { MonitorCog, MoonStar, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const themes = [
  {
    id: "light",
    icon: SunMedium,
    label: "Light",
  },
  {
    id: "dark",
    icon: MoonStar,
    label: "Dark",
  },
  {
    id: "system",
    icon: MonitorCog,
    label: "System",
  },
] as const;

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    const currentIndex = themes.findIndex(({ id }) => id === theme);
    if (currentIndex >= 0) {
      setIndex(currentIndex);
    }
  }, [theme, mounted]);

  const handleToggle = () => {
    const nextIndex = (index + 1) % themes.length;
    setIndex(nextIndex);
    setTheme(themes[nextIndex].id);
  };

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 cursor-wait rounded-full border border-white/10 bg-white/10"
        aria-label="Menginisialisasi toggle tema"
        disabled
      >
        <span className="sr-only">Menginisialisasi toggle tema</span>
      </Button>
    );
  }

  const activeTheme = themes[index];

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-background/80 px-1.5 py-1 shadow-lg backdrop-blur">
      <Badge
        variant="outline"
        className="border-transparent bg-white/5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
      >
        Mode
      </Badge>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="group relative flex items-center gap-2 rounded-full border border-transparent bg-white/10 px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/10"
        aria-label={`Ubah tema menjadi ${themes[(index + 1) % themes.length].label}`}
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-indigo-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <activeTheme.icon className="size-4 shrink-0 text-primary" />
        <span className="relative text-sm font-semibold capitalize tracking-wide">
          {activeTheme.label}
        </span>
      </Button>
    </div>
  );
}

