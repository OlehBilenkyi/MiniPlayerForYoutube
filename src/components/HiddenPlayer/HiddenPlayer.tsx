import React from "react";
import ReactPlayer from "react-player";
import "./HiddenPlayer.scss";

interface HiddenPlayerProps {
  playerRef: React.MutableRefObject<ReactPlayer | null>;
  url: string;
  isPlaying: boolean;
  volume: number;
  onReady: (e: any) => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onEnded: () => void;
  initAnalyser: (media: HTMLMediaElement) => void;
  showVideo?: boolean;
}

const HiddenPlayer: React.FC<HiddenPlayerProps> = ({
  playerRef,
  url,
  isPlaying,
  volume,
  onReady,
  onProgress,
  onEnded,
  initAnalyser,
  showVideo = false,
}) => {
  const blockClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`hidden-player-wrapper ${showVideo ? "visible" : "hidden"}`}
    >
      {showVideo && (
        <div className="video-overlay" onClick={blockClick}>
          Click to interact
        </div>
      )}
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        controls={false} // 🔴 Важно: отключает стандартные контролы
        width="100%"
        height="100%"
        volume={volume / 100}
        config={{
          youtube: {
            playerVars: {
              // Основные параметры для отключения управления
              controls: 0, // Полностью отключает элементы управления
              disablekb: 1, // Блокирует клавиатурные shortcuts
              fs: 0, // Отключает полноэкранный режим
              modestbranding: 1, // Убирает лого YouTube (кроме маленького в углу)
              rel: 0, // Отключает похожие видео в конце
              iv_load_policy: 3, // Отключает аннотации
              playsinline: 1, // Запрещает полноэкранный режим на iOS

              // Дополнительные параметры для максимального ограничения
              showinfo: 0, // Скрывает информацию о видео
              autohide: 1, // Автоматически скрывает элементы
              cc_load_policy: 0, // Отключает субтитры
              color: "white", // Минимизирует элементы прогресс-бара
              hl: "en", // Язык интерфейса (можно изменить)
              enablejsapi: 1, // Включает JS API для большего контроля

              // Особые параметры для встраивания
              widget_referrer: "https://yourdomain.com", // Указывает ваш домен
            },
          },
        }}
      />
      {!showVideo && <div className="player-placeholder">Player is hidden</div>}
    </div>
  );
};

export default HiddenPlayer;
