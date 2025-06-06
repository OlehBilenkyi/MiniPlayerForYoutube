export interface PlaylistItem {
  videoId: string;
  title: string;
}

// Эта функция имитирует асинхронный запрос к серверу.
// В реальности вы могли бы использовать fetch/axios, но здесь просто промис.
export function fetchPlaylist(): Promise<PlaylistItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { videoId: "dQw4w9WgXcQ", title: "Rick Astley – Never Gonna Give You Up" },
        { videoId: "3tmd-ClpJxA", title: "Eminem – Lose Yourself" },
        { videoId: "JGwWNGJdvx8", title: "Ed Sheeran – Shape of You" },
      ]);
    }, 300); // имитируем задержку 300ms
  });
}

