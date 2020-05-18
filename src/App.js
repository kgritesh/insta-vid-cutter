import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Container } from "react-bootstrap";

import Dropzone from "./components/Dropzone";
import VideoDetails from "./components/VideoDetails";
import logo from "./img/logoHeader.svg";
import logoIcon from "./img/logoIcon.svg";
import { HorizontalDivider } from "./common/styles";
import GithubRibbon from "./components/GithubRibbon";

import theme from "./theme";

const StyledContainer = styled(Container)`
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background}
  display: flex;
  flex-direction: column;
  font-family: Open Sans,sans-serif;
`;

const NavBar = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoIcon = styled.img`
  margin-top: 15px;
  height: 30px;
`;
const LogoHeader = styled.img`
  margin-top: 30px;
  padding-left: 10px;
  height: 20px;
`;

const Header = styled.div`
  margin: 30px auto;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1 0 auto;
  align-self: center;
`;

const Title = styled.h1`
  font-size: ${(props) => props.theme.textSize.large};
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

const Footer = styled.div`
  color: ${(props) => props.theme.colors.footerText};
  font-size: ${(props) => props.theme.textSize.small};
  text-align: center;
  flex: 0 0 auto;
  & a {
    text-decoration: none;
    color: black;
  }
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
      <StyledContainer>
        <NavBar>
          <div>
            <LogoIcon src={logoIcon} alt="" />
            <LogoHeader src={logo} alt="Insta Video Spitter" />
          </div>
        </NavBar>
        <GithubRibbon
          url="https://github.com/kgritesh/insta-vid-cutter"
          title="Fork me on GitHub"
        >
          Fork me on GitHub
        </GithubRibbon>
        <Header>
          <Title> Split Video </Title>
          <SubTitle>
            {" "}
            Split video into multiple 15 second clips for instagram story{" "}
          </SubTitle>
        </Header>
        <Content>
          {videoFile === null ? (
            <Dropzone setVideoFile={onVideoUploaded} />
          ) : (
            <VideoDetails videoFile={videoFile} onCancel={onCancel} />
          )}
        </Content>
        <HorizontalDivider />
        <Footer>
          <i>Check out my </i>
          <a
            href="https://vertexcover.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            personal website
          </a>
          <i> for a list of other projects that i have worked on.</i>
        </Footer>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default App;
