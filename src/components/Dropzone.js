import React, { useCallback } from 'react';
import styled from 'styled-components';
import {useDropzone} from 'react-dropzone';

import { BorderedDiv } from '../common/styles';

const DropZoneContainer = styled(BorderedDiv)`
  max-width: 600px;
  height: 140px;
  cursor: pointer;

  &:hover {
   color: #ffffff;
   background-color: ${props => props.theme.colors.light};
  }
`

const StyledText = styled.p`
  text-align: center;
  justify-content: center;
  display: inline-block; 
  font-size: color: ${props => props.theme.textSize.small};
  margin: 0 auto;
`

const Dropzone = ({ setVideoFile }) => { 

  const onDrop = useCallback(files => {
    setVideoFile(files[0]);
  }, [setVideoFile]);
  
  const {getRootProps, getInputProps} = useDropzone({
    multiple: false,
    accept: 'video/*',
    onDrop
  });
 
  return (
    <DropZoneContainer {...getRootProps()}>
      <input {...getInputProps() } />
      <StyledText>Drag 'n' drop some files here, or click to select files</StyledText>
    </DropZoneContainer>
  );    
};

export default Dropzone;


