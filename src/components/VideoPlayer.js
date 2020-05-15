import React, { useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ videoFileURL, updateVideoDuration }) => {
  const [videoPlayerRef, setPlayerRef] = useState(null);

  const mediaPlayerReady = () => {
    updateVideoDuration(videoPlayerRef.getDuration());
  };

  return (
    <ReactPlayer
      ref={setPlayerRef}
      url={videoFileURL}
      controls
      width="100%"
      height="auto"
      onReady={mediaPlayerReady}
    />
  );
};

export default VideoPlayer;
