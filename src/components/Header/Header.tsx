import React, { memo } from "react";
import "./Header.scss";

interface Props {
  title: string;
  videoTitle: string;
  isDark: boolean;
  onToggleTheme: () => void;
  extraControls?: React.ReactNode;
}

const ThemeToggle: React.FC<{ isDarkMode: boolean; onToggle: () => void }> = ({
  isDarkMode,
  onToggle,
}) => (
  <button onClick={onToggle} className="theme-toggle">
    {isDarkMode ? "Light Mode" : "Dark Mode"}
  </button>
);

const Header: React.FC<Props> = ({ title, videoTitle, isDark, onToggleTheme, extraControls }) => (
  <header className="header" aria-label="YouTube Audio Player">
    <h1 className="header__title">{title}</h1>
    <h2 className="header__subtitle" aria-live="polite">{videoTitle}</h2>
    <div className="header__extra-controls">
      {extraControls}
      <ThemeToggle isDarkMode={isDark} onToggle={onToggleTheme} />
    </div>
  </header>
);

export default memo(Header);
