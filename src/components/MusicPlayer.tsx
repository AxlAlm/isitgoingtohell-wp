import React, { useRef, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

type MusicPlayerProps = {
  url: string;
};

const MusicPlayer = (props: MusicPlayerProps) => {
  const audioElement = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  function handlePlayButtonClick() {
    if (audioElement.current) {
      if (isPlaying) {
        audioElement.current.pause();
      } else {
        audioElement.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <div>
      <audio ref={audioElement} src={props.url} />
      <button onClick={handlePlayButtonClick}>
        {isPlaying ? (
          <PauseIcon fontSize="large" sx={{ color: "pink" }} />
        ) : (
          <PlayArrowIcon fontSize="large" sx={{ color: "pink" }} />
        )}
      </button>{" "}
    </div>
  );
};

export default MusicPlayer;
