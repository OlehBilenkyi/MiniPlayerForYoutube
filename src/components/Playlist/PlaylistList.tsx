import React from "react";
import { PlaylistItem } from "../../data/mockPlaylist";
import "./PlaylistList.scss"; // здесь находятся стили для списка

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
    return <div>Загрузка плейлиста...</div>;
  }

  return (
    <ul className="yt-playlist">
      {items.map((item, idx) => (
        <li
          key={item.videoId}
          className={
            idx === currentIndex
              ? "yt-playlist-item active"
              : "yt-playlist-item"
          }
          onClick={() => onSelect(idx)}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default PlaylistList;
