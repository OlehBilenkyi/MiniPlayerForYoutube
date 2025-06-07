import { useState, useEffect, useCallback } from "react";

export interface PlaylistItem {
  videoId: string;
  title: string;
}

const API_KEY = import.meta.env.VITE_PLAYER as string;
const YT_PLAYLIST_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

async function fetchPage(
  playlistId: string,
  apiKey: string,
  pageToken?: string
) {
  const params = new URLSearchParams({
    part: "snippet",
    maxResults: "50",
    playlistId,
    key: apiKey,
  });
  if (pageToken) params.set("pageToken", pageToken);

  const resp = await fetch(`${YT_PLAYLIST_ITEMS_API}?${params.toString()}`);
  if (!resp.ok) {
    throw new Error(`YouTube API error: ${resp.status}`);
  }
  return resp.json() as Promise<{
    items: Array<{
      snippet: {
        title: string;
        resourceId: { videoId: string };
      };
    }>;
    nextPageToken?: string;
  }>;
}

export function usePlaylist(playlistId: string) {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlaylist = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!API_KEY) {
      setError("API key is missing");
      setLoading(false);
      return;
    }

    try {
      let all: PlaylistItem[] = [];
      let nextPage: string | undefined = undefined;

      do {
        const data = await fetchPage(playlistId, API_KEY, nextPage);
        data.items.forEach((i) => {
          all.push({
            videoId: i.snippet.resourceId.videoId,
            title: i.snippet.title,
          });
        });
        nextPage = data.nextPageToken;
      } while (nextPage);

      setPlaylist(all);
      if (currentIndex >= all.length) {
        setCurrentIndex(0);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [playlistId, currentIndex]);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  const changeTrack = useCallback(
    (
      newIndex: number,
      autoPlay: boolean,
      playFn: () => void,
      seekFn: (sec: number) => void
    ) => {
      if (newIndex < 0 || newIndex >= playlist.length) return;
      setCurrentIndex(newIndex);
      seekFn(0);
      if (autoPlay) {
        setTimeout(playFn, 200);
      }
    },
    [playlist.length]
  );

  return { playlist, currentIndex, changeTrack, loading, error };
}
