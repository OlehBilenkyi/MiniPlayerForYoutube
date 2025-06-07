import { useState, useEffect, useCallback } from "react";

const THEME_KEY = "ytAudioPlayerTheme";

/**
 * Хук для управления темой оформления (тёмная/светлая) с сохранением состояния в localStorage.
 *
 * @returns {object} Объект с текущей темой и функцией переключения темы.
 * @property {boolean} isDark - Активна ли тёмная тема.
 * @property {() => void} toggleTheme - Функция переключения темы.
 */
export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false; // SSR safe
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
    } catch {
      // Игнорируем ошибки записи в localStorage
    }
  }, [isDark]);

  /**
   * Переключает тему с тёмной на светлую и обратно.
   */
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  return { isDark, toggleTheme };
}
