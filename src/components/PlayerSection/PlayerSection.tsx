import React from "react";
import "./PlayerSection.scss";

export interface PlaylistItem {
  videoId: string;
  title: string;
}

interface PlaylistSectionProps {
  items?: PlaylistItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({
  items = [],
  currentIndex,
  onSelect,
}) => {
  if (items.length === 0) {
    return <div className="empty-playlist">Плейлист пуст</div>;
  }

  return (
    <ul className="yt-playlist">
      {items.map((item, idx) => (
        <li
          key={item.videoId}
          className={`yt-playlist-item ${idx === currentIndex ? "active" : ""}`}
          onClick={() => onSelect(idx)}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default PlaylistSection;
