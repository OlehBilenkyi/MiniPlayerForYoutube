import React from "react";

interface HeaderProps {
  title: string;
  videoTitle: string;
  isDark: boolean;
  onToggleTheme: () => void;
  extraControls?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  videoTitle,
  isDark,
  onToggleTheme,
  extraControls, // Добавляем пропс в параметры
}) => {
  return (
    <div className="header-container">
      <div className="header-content">
        <h1>{title}</h1>
        <p>{videoTitle}</p>
      </div>
      <div className="header-controls">
        <button onClick={onToggleTheme}>
          {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
        {extraControls} {/* Добавляем отображение extraControls */}
      </div>
    </div>
  );
};

export default Header;
