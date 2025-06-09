import React from "react";
import "./Header.scss";

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
  extraControls,
}) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <div className="extra-controls">
        {extraControls}
        <button className="theme-toggle" onClick={onToggleTheme}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d={
                isDark
                  ? "M12,18.5A6.5,6.5,0,1,1,18.5,12A6.5,6.5,0,0,1,12,18.5M12,3A9,9,0,1,0,21,12A9,9,0,0,0,12,3Z"
                  : "M12,16A4,4,0,1,1,16,12A4,4,0,0,1,12,16M12,2A10,10,0,1,0,22,12A10,10,0,0,0,12,2Z"
              }
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
