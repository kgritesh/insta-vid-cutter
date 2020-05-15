import React, { useState } from "react";
import styled from "styled-components";

const VideoInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  color: ${(props) => props.theme.colors.main};
  font-size: ${(props) => props.theme.textSize.medium};
  font-weight: 500;
`;

const VideoInfo = ({ name, duration }) => (
  <VideoInfoContainer>
    <div>{`Name: ${name}`}</div>
    <div>{`Duration: ${duration} seconds`}</div>
  </VideoInfoContainer>
);

export default VideoInfo;
