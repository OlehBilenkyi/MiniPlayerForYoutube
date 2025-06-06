
import { useState, useEffect, useCallback } from "react";
import { fetchPlaylist, PlaylistItem } from "../../data/mockPlaylist";

export function usePlaylist(initialIndex = 0) {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // при монтировании компонента загружаем «серверный» плейлист
    fetchPlaylist()
      .then((data) => {
        setPlaylist(data);
        // если в хранилище пользователь сохранил другой индекс — можно восстановить
        if (initialIndex >= data.length) {
          setCurrentIndex(0);
        }
      })
      .finally(() => setLoading(false));
  }, [initialIndex]);

  const changeTrack = useCallback((newIndex: number, autoPlay: boolean, playFn: () => void, seekFn: (sec: number) => void) => {
    if (newIndex < 0 || newIndex >= playlist.length) return;
    setCurrentIndex(newIndex);
    // перемещаемся на начало трека
    seekFn(0);
    if (autoPlay) {
      // небольшая задержка, чтобы ReactPlayer успел сменить src
      setTimeout(playFn, 200);
    }
  }, [playlist]);

  return {
    playlist,
    currentIndex,
    setCurrentIndex,
    changeTrack,
    loading,
  };
}
