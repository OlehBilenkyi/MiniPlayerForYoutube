import React from "react";
import "./ThemeToggle.scss";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="theme-toggle"
      title="Toggle light/dark theme"
    >
      {isDarkMode ? (
        <>
          <span role="img" aria-label="sun">
            ☀️
          </span>{" "}
          Light
        </>
      ) : (
        <>
          <span role="img" aria-label="moon">
            🌙
          </span>{" "}
          Dark
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
