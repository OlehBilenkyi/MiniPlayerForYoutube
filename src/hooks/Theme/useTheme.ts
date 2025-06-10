// src/hooks/Theme/useTheme.ts
import { useState, useEffect, useCallback, useMemo } from "react";

type ThemeMode = "light" | "dark";

interface UseThemeReturn {
  isDark: boolean;
  currentTheme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export function useTheme(): UseThemeReturn {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;

    try {
      // Check localStorage first
      const saved = localStorage.getItem("miniPlayerTheme");
      if (saved) return saved === "dark";

      // Fallback to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );

    try {
      localStorage.setItem("miniPlayerTheme", isDark ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setIsDark(theme === "dark");
  }, []);

  const currentTheme = useMemo(() => (isDark ? "dark" : "light"), [isDark]);

  return {
    isDark,
    currentTheme,
    toggleTheme,
    setTheme,
  };
}
