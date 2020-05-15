import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import * as Comlink from "comlink";
import { BorderedDiv } from "../common/styles";
import VideoInfo from "./VideoInfo";
//import VideoPlayer from "./VideoPlayer";
/* eslint-disable import/no-webpack-loader-syntax */
import Worker from "worker-loader!./worker";
import { formatTime } from "./utils";

const VidContainer = styled(BorderedDiv)`
  display: flex;
  flex-direction: column;
  margin: 20px auto;
`;
// const ChildDiv = styled.div`
//   flex: 1 1 0px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const BtnWrapper = styled.div`
//   align-items: center;
//   justify-content: center;
// `;

const StyledButton = styled(Button)`
  margin-left: 10px;
  margin-right: 10px;
`;

async function* splitVideo(videoFile) {
  const worker = new Worker("../worker.js");
  const ffmpeg = await Comlink.wrap(worker);
  const fileContent = await videoFile.data.arrayBuffer();
  let results = [];
  let counter = 1;
  const [videoName, ext] = videoFile.name.split(".");
  for (let i = 0; i < videoFile.duration; i += 15) {
    const startTime = formatTime(i);
    const endTime = formatTime(i + 15);
    const outputFileName = `${videoName}-${counter}.${ext}`;
    const result = await ffmpeg({
      MEMFS: [{ name: videoFile.name, data: fileContent }],
      arguments: [
        "-i",
        videoFile.name,
        "-ss",
        startTime,
        "-to",
        endTime,
        "-c",
        "copy",
        outputFileName,
      ],
    });
    const outputFile = result.MEMFS[0];
    console.log(`Processed from ${startTime} to ${endTime}`);
    yield {
      name: outputFile.name,
      data: outputFile.data,
      duration: 15,
    };
    counter += 1;
  }
  return results;
}

const VideoSplitter = ({ videoFile, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [videoParts, setVideoParts] = useState([]);

  useEffect(() => {
    const splitter = async () => {
      for await (let video of splitVideo(videoFile)) {
        setVideoParts((oldArr) => [...oldArr, video]);
      }
      setLoading(false);
    };
    splitter();
  }, [videoFile]);

  return (
    <VidContainer>
      {loading && <Spinner animation="border" />}
      {videoParts.map((part) => (
        <VideoInfo name={part.name} duration={part.duration} />
      ))}

      <StyledButton variant="danger" size="lg" onClick={onCancel}>
        Cancel
      </StyledButton>
    </VidContainer>
  );
};

export default VideoSplitter;
