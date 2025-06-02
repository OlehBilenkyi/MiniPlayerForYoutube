import React, { useState, useRef, useEffect } from "react";
import YouTube from "react-youtube";
import "./YoutubePlayer.css";

const YouTubeAudioPlayer = () => {
  // Список YouTube Video ID (плейлист)
  const playlist = [
    "dQw4w9WgXcQ", // Пример: Rick Astley – Never Gonna Give You Up
    "3tmd-ClpJxA", // Пример: Eminem – Lose Yourself
    "JGwWNGJdvx8", // Пример: Ed Sheeran – Shape of You
    // При желании добавьте свои ID
  ];

  // Состояния
  const [currentIndex, setCurrentIndex] = useState(0); // текущий индекс в плейлисте
  const [isPlaying, setIsPlaying] = useState(false); // флаг «играет / на паузе»
  const [progress, setProgress] = useState(0); // текущее время (в секундах)
  const [duration, setDuration] = useState(0); // длительность ролика (в секундах)
  const [volume, setVolume] = useState(100); // громкость (0–100)

  // Ссылка на YouTube Player API (объект плеера)
  const playerRef = useRef(null);

  // /**
  //  * Опции для YouTube IFrame
  //  * - height и width = '0', чтобы «спрятать» iframe
  //  * - playerVars:
  //  *    autoplay: 0  (минимум автозапуск, мы сами управляем)
  //  *    controls: 0  (убирает стандартные YouTube-кнопки)
  //  *    modestbranding: 1 (минимизирует логотип YouTube)
  //  *    rel: 0       (учить похожие видео не показывать)
  //  *    iv_load_policy: 3 (скрывает аннотации)
  //  */
  const opts = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
    },
  };

  // Колбэк, вызываемый, когда YouTube-плеер готов
  const onPlayerReady = (event) => {
    // event.target – это экземпляр YouTube Player
    playerRef.current = event.target;
    // Устанавливаем изначально громкость
    playerRef.current.setVolume(volume);
    // Если isPlaying=true, сразу начинаем проигрывать
    if (isPlaying) {
      playerRef.current.playVideo();
    }
    // Получаем длительность ролика (через секунду–другую, т.к. может быть ещё не загружено)
    setTimeout(() => {
      const dur = playerRef.current.getDuration();
      if (!isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
    }, 500);
  };

  // Отслеживание прогресса (текущее время)
  useEffect(() => {
    let intervalId = null;
    if (playerRef.current && isPlaying) {
      intervalId = setInterval(() => {
        const curr = playerRef.current.getCurrentTime();
        setProgress(curr);
      }, 500);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, currentIndex]);

  // Обработчик смены трека
  const changeTrack = (newIndex, autoPlay = true) => {
    if (playerRef.current) {
      playerRef.current.stopVideo();
    }
    setCurrentIndex(newIndex);
    setProgress(0);
    setDuration(0);
    setIsPlaying(autoPlay);
  };

  // Кнопка Play/Pause
  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  // Кнопка «следующий трек»
  const playNext = () => {
    const nextIdx = (currentIndex + 1) % playlist.length;
    changeTrack(nextIdx, true);
  };

  // Кнопка «предыдущий трек»
  const playPrev = () => {
    const prevIdx = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    changeTrack(prevIdx, true);
  };

  // Когда видео заканчивается (state = 0), переключаемся на следующий
  const onPlayerStateChange = (event) => {
    if (event.data === 0) {
      // 0 → ENDED
      playNext();
    }
  };

  // Обработчик перемотки (ползунок прогресса)
  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, true);
      setProgress(newTime);
    }
  };

  // Изменение громкости
  const handleVolume = (e) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    if (playerRef.current) {
      playerRef.current.setVolume(newVol);
    }
  };

  return (
    <div className="yt-audio-player-container">
      <h2>MiniPlayer</h2>

      {/* Список плейлиста */}
      <ul className="yt-playlist">
        {playlist.map((videoId, idx) => (
          <li
            key={videoId}
            className={
              idx === currentIndex
                ? "yt-playlist-item active"
                : "yt-playlist-item"
            }
            onClick={() => changeTrack(idx, true)}
          >
            {videoId}
          </li>
        ))}
      </ul>

      {/* Скрытый IFrame YouTube-плеера */}
      <YouTube
        videoId={playlist[currentIndex]}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
      />

      {/* Кнопки управления */}
      <div className="yt-controls">
        <button onClick={playPrev} className="yt-btn">
          ⏮️
        </button>
        <button onClick={handlePlayPause} className="yt-btn">
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        <button onClick={playNext} className="yt-btn">
          ⏭️
        </button>
      </div>

      {/* Прогресс-бар */}
      <div className="yt-progress-container">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={progress}
          onChange={handleSeek}
          className="yt-progress-bar"
        />
        <div className="yt-time-labels">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Громкость */}
      <div className="yt-volume-container">
        <label htmlFor="yt-volume">Громкость:</label>
        <input
          id="yt-volume"
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          onChange={handleVolume}
        />
      </div>
    </div>
  );
};

// Функция для преобразования секунд в формат mm:ss
function formatTime(time) {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

export default YouTubeAudioPlayer;
