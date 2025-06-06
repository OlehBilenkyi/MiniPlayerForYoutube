import React from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  return (
    <div className="header-row">
      <h2>YouTube Audio Player</h2>
      <ThemeToggle isDarkMode={isDark} onToggle={onToggleTheme} />
    </div>
  );
};

export default Header;
