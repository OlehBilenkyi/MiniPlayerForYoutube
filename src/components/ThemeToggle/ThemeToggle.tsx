// src/components/ThemeToggle/ThemeToggle.tsx
import React from "react";
import "./ThemeToggle.scss";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => (
  <button
    onClick={onToggle}
    className="theme-toggle"
    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
  >
    <span className={`theme-toggle__icon ${isDarkMode ? "sun" : "moon"}`} />
    {isDarkMode ? "Light Mode" : "Dark Mode"}
  </button>
);

export default React.memo(ThemeToggle);
