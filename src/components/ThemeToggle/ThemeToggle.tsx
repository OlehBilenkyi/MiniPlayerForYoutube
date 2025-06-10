import React, { memo } from "react";
import "./ThemeToggle.scss";

interface Props {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<Props> = ({ isDarkMode, onToggle }) => (
  <button
    type="button"
    className="theme-toggle"
    onClick={onToggle}
    aria-pressed={isDarkMode}
    aria-label="Toggle theme"
  >
    {isDarkMode ? "☀️ Light" : "🌙 Dark"}
  </button>
);

export default memo(ThemeToggle);
