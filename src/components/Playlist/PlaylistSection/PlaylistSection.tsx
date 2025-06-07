import React from "react";
import { PlaylistItem } from "../../../data/mockPlaylist";
import "./PlaylistSection.scss";

interface PlaylistSectionProps {
  items: PlaylistItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const PlaylistSection: React.FC<PlaylistSectionProps> = ({ items, currentIndex, onSelect }) => {
  if (items.length === 0) {
    return <div className="empty-playlist">Playlist is empty</div>;
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
