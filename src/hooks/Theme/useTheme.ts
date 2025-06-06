
import { useState, useEffect, useCallback } from "react";

const THEME_KEY = "ytAudioPlayerTheme";

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(THEME_KEY) || "null");
      return saved ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
    } catch {}
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return {
    isDark,
    toggleTheme,
  };
}
