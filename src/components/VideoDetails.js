import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import * as Comlink from "comlink";
import ReactPlayer from "react-player";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import VideoPlayer from "./VideoPlayer";
import { BorderedDiv } from "../common/styles";
import { extractNameAndExt } from "../utils";

/* eslint import/no-webpack-loader-syntax: off */
import Worker from "worker-loader!../worker";
import { formatTime } from "../utils";

const SplitStateEnum = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

const VidContainer = styled(BorderedDiv)`
  display: flex;
  flex-direction: column;
  margin: 20px auto;
`;
const WrapperDiv = styled.div`
  display: flex;
  margin-bottom: 30px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ChildDiv = styled.div`
  flex: 1 1 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BtnWrapper = styled.div`
  align-items: center;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  margin-left: 10px;
  margin-right: 10px;
`;

const VideoInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  color: ${(props) => props.theme.colors.main};
  font-size: ${(props) => props.theme.textSize.small};
  font-weight: 500;
  margin-bottom: 20px;

  & .btn-group {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

const NotSelectedDiv = styled.div`
  display: flex;
  align-self: center
  color: ${(props) => props.theme.colors.main};
  font-size: ${(props) => props.theme.textSize.medium};
`;

async function* splitVideo(videoFile, duration) {
  const worker = new Worker("../worker.js");
  const ffmpeg = await Comlink.wrap(worker);
  const fileContent = await videoFile.data.arrayBuffer();
  const [videoName, ext] = extractNameAndExt(videoFile.name);
  let counter = 1;
  for (let i = 0; i < duration; i += 15) {
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
        "-loglevel",
        "panic",
      ],
    });

    const outputFile = result.MEMFS[0];
    const outputBlob = new Blob([outputFile.data]);
    yield {
      name: outputFile.name,
      data: outputBlob,
      url: URL.createObjectURL(outputBlob),
      duration: i + 15 > duration ? Math.floor(duration % 15) : 15,
    };
    counter += 1;
  }
}

const VideoInfo = ({ name, duration, onPlay = null, onDownload = null }) => (
  <VideoInfoContainer>
    <div>{`Name: ${name}`}</div>
    <div>{`Duration: ${duration} seconds`}</div>
    <ButtonGroup>
      {onPlay !== null && (
        <StyledButton variant="outline-primary" onClick={onPlay}>
          Play
        </StyledButton>
      )}
      {onDownload !== null && (
        <StyledButton variant="outline-success" onClick={onDownload}>
          Download
        </StyledButton>
      )}
    </ButtonGroup>
  </VideoInfoContainer>
);

const UploadedVideo = React.memo(
  ({ videoFile, videoDuration, updateVideoDuration }) => (
    <WrapperDiv>
      <ChildDiv>
        {videoDuration === null ? (
          <Spinner animation="border" />
        ) : (
          <VideoInfo name={videoFile.name} duration={videoDuration} />
        )}
      </ChildDiv>
      <ChildDiv>
        <VideoPlayer
          videoFileURL={videoFile.url}
          updateVideoDuration={(dur) => updateVideoDuration(parseInt(dur))}
        />
      </ChildDiv>
    </WrapperDiv>
  )
);

const SplitVideo = ({ videoFile, videoDuration, onSplitComplete }) => {
  const [splitState, setSplitState] = useState(SplitStateEnum.IN_PROGRESS);
  const [selectedVideo, selectVideo] = useState(null);
  const [isPlaying, setPlaying] = useState(false);
  const playVideo = (part) => () => {
    selectVideo(part);
    setPlaying(true);
  };
  const downloadVideo = (part) => () => saveAs(part.data, part.name);
  const [videoParts, setVideoParts] = useState([]);

  useEffect(() => {
    const split = async function () {
      let first = true;
      for await (let video of splitVideo(videoFile, videoDuration)) {
        if (first) {
          first = false;
          selectVideo(video);
        }
        setVideoParts((oldArr) => [...oldArr, video]);
      }
      setSplitState(SplitStateEnum.COMPLETED);
      onSplitComplete(videoParts);
    };
    split();
  }, []);

  return (
    <WrapperDiv>
      <ChildDiv>
        {videoParts.map((part) => (
          <VideoInfo
            key={part.name}
            name={part.name}
            duration={part.duration}
            onPlay={playVideo(part)}
            onDownload={downloadVideo(part)}
          />
        ))}
        {splitState === SplitStateEnum.IN_PROGRESS && (
          <Spinner animation="border" />
        )}
      </ChildDiv>
      <ChildDiv>
        {selectedVideo ? (
          <ReactPlayer
            url={selectedVideo.url}
            controls
            width="100%"
            height="auto"
            playing={isPlaying}
          />
        ) : (
          <NotSelectedDiv> No Video Selected </NotSelectedDiv>
        )}
      </ChildDiv>
    </WrapperDiv>
  );
};

const VideoDetails = ({ videoFile, onCancel }) => {
  const [videoDuration, updateVideoDuration] = useState(null);
  const [splitState, setSplitState] = useState(SplitStateEnum.NOT_STARTED);
  const startSplit = async () => {
    setSplitState(SplitStateEnum.IN_PROGRESS);
  };

  let splitVideoParts = null;

  const onSplitComplete = (videoParts) => {
    splitVideoParts = videoParts;
    setSplitState(SplitStateEnum.COMPLETED);
  };

  const downloadFiles = async () => {
    const zip = new JSZip();
    splitVideoParts.map((file) => zip.file(file.name, file.data));
    const zipFile = await zip.generateAsync({ type: "blob" });
    const [videoName, _] = videoFile.name.split(".");
    saveAs(zipFile, `${videoName}-parts.zip`);
  };

  return (
    <VidContainer>
      {splitState === SplitStateEnum.NOT_STARTED ? (
        <UploadedVideo
          videoFile={videoFile}
          videoDuration={videoDuration}
          updateVideoDuration={updateVideoDuration}
        />
      ) : (
        <SplitVideo
          videoFile={videoFile}
          videoDuration={videoDuration}
          onSplitComplete={onSplitComplete}
        />
      )}
      {videoDuration !== null && (
        <BtnWrapper>
          {splitState === SplitStateEnum.NOT_STARTED ? (
            <StyledButton variant="success" size="lg" onClick={startSplit}>
              Split{"  "}
            </StyledButton>
          ) : (
            <StyledButton
              disabled={splitState === SplitStateEnum.IN_PROGRESS}
              variant="success"
              size="lg"
              onClick={downloadFiles}
            >
              Download All{"  "}
            </StyledButton>
          )}
          <StyledButton variant="danger" size="lg" onClick={onCancel}>
            Cancel
          </StyledButton>
        </BtnWrapper>
      )}
    </VidContainer>
  );
};

export default VideoDetails;
