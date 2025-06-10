import { useState, useEffect, useCallback } from "react";

export interface PlaylistItem {
  videoId: string;
  title: string;
}

interface YouTubeApiResponse {
  items: Array<{
    snippet: {
      title: string;
      resourceId: {
        videoId: string;
      };
    };
  }>;
  nextPageToken?: string;
}

interface UsePlaylistResult {
  playlist: PlaylistItem[];
  currentIndex: number;
  changeTrack: (
    newIndex: number,
    autoPlay: boolean,
    playFn: () => void,
    seekFn: (sec: number) => void,
    pauseFn?: () => void
  ) => void;
  reload: () => void;
  loading: boolean;
  error: Error | null;
}

const API_KEY = import.meta.env.VITE_PLAYER as string;
const YT_PLAYLIST_ITEMS_API =
  "https://www.googleapis.com/youtube/v3/playlistItems";

async function fetchPage(
  playlistId: string,
  apiKey: string,
  pageToken?: string
): Promise<YouTubeApiResponse> {
  const params = new URLSearchParams({
    part: "snippet",
    maxResults: "50",
    playlistId,
    key: apiKey,
  });
  if (pageToken) params.set("pageToken", pageToken);

  const resp = await fetch(`${YT_PLAYLIST_ITEMS_API}?${params.toString()}`);
  if (!resp.ok) throw new Error(`YouTube API error: ${resp.status}`);
  return resp.json();
}

export function usePlaylist(playlistId: string): UsePlaylistResult {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPlaylist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!API_KEY) throw new Error("API key is missing");
      if (!playlistId) throw new Error("Playlist ID is required");

      let all: PlaylistItem[] = [];
      let nextPage: string | undefined;
      let pageCount = 0;
      const MAX_PAGES = 10;

      while (pageCount < MAX_PAGES) {
        const data = await fetchPage(playlistId, API_KEY, nextPage);
        all.push(
          ...data.items.map((item) => ({
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
          }))
        );
        nextPage = data.nextPageToken;
        pageCount++;
        if (!nextPage) break;
      }

      if (all.length === 0) throw new Error("Playlist is empty");
      setPlaylist(all);
      setCurrentIndex((prev) => (prev >= all.length ? 0 : prev));
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [playlistId]);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  const reload = useCallback(() => void loadPlaylist(), [loadPlaylist]);

  const changeTrack = useCallback(
    (
      newIndex: number,
      autoPlay: boolean,
      playFn: () => void,
      seekFn: (sec: number) => void,
      pauseFn?: () => void
    ) => {
      if (newIndex < 0 || newIndex >= playlist.length) return;
      pauseFn?.();
      setCurrentIndex(newIndex);
      seekFn(0);
      if (autoPlay) {
        setTimeout(() => {
          seekFn(0);
          playFn();
        }, 300);
      }
    },
    [playlist.length]
  );

  return {
    playlist,
    currentIndex,
    changeTrack,
    reload,
    loading,
    error,
  };
}
