import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Container } from "react-bootstrap";

import Dropzone from "./components/Dropzone";
import VideoDetails from "./components/VideoDetails";

import theme from "./theme";

const StyledContainer = styled(Container)`
  max-width: 960px;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background}
  display: flex;
  flex-direction: column;
  font-family: Open Sans,sans-serif;
`;

const NavBar = styled.div`
  height: 100px;
`;

const Header = styled.div`
  margin: 20px auto;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.textSize.xLarge};
  font-weight: 800;
  justify-content: center;
  color: ${(props) => props.theme.colors.main};
  text-align: center;
  margin: 10px;
  font-family: Raleway, sans-serif;
`;

const SubTitle = styled.h2`
  font-size: ${(props) => props.theme.textSize.medium};
  font-weight: 500;
  text-align: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.main};
  margin: 10px;
`;

const App = () => {
  const [videoFile, setVideoFile] = useState(null);
  const onCancel = () => setVideoFile(null);
  const onVideoUploaded = (videoBlob) => {
    setVideoFile({
      name: videoBlob.name,
      data: videoBlob,
      url: URL.createObjectURL(videoBlob),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer fluid>
        <NavBar />
        <Header>
          <Title> Split Video </Title>
          <SubTitle>
            {" "}
            Split video into multiple 15 second clips for instagram story{" "}
          </SubTitle>
        </Header>
        {videoFile === null ? (
          <Dropzone setVideoFile={onVideoUploaded} />
        ) : (
          <VideoDetails videoFile={videoFile} onCancel={onCancel} />
        )}
      </StyledContainer>
    </ThemeProvider>
  );
};

export default App;
