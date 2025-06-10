import React, { memo } from "react";
import { PlaylistItem } from "../../data/mockPlaylist";
import "./PlaylistList.scss";

interface PlaylistListProps {
  items: PlaylistItem[];
  currentIndex: number;
  onSelect: (idx: number) => void;
  loading: boolean;
}

const PlaylistList: React.FC<PlaylistListProps> = ({
  items,
  currentIndex,
  onSelect,
  loading,
}) => {
  if (loading) {
    return <div className="loading-playlist">Loading playlist...</div>;
  }
  return (
    <ul className="yt-playlist-list">
      {items.map((item, idx) => (
        <li
          key={`${item.videoId}-${idx}`} // уникальный ключ
          className={`yt-playlist-list-item ${
            idx === currentIndex ? "active" : ""
          }`}
          onClick={() => onSelect(idx)}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default memo(PlaylistList);
