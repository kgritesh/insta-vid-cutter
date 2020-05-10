
import React, { useState, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import {useDropzone} from 'react-dropzone';
import ReactPlayer from 'react-player'
import * as Comlink from 'comlink';


import './App.css';
/* eslint-disable import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./worker';
import {useAsync} from './utils';

const styles = {
  container:  {
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif",
    marginTop: "20px"
  },

  flexDiv: {
    display: "flex",
    flexDirection: "column",    
  },

  player: {
    backgroundColor: "#fafafa"
  },

  dropzone: {    
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    marginTop: 10,
    marginBottom: 10 
  },

  submitBtn: {
    alignItems: "center",
    marginTop: 10
  }
};

const Dropzone = ({ setVideoFile }) => { 

  const onDrop = useCallback(files => {
    console.log(setVideoFile, files);
    setVideoFile(files[0]);
  }, [setVideoFile]);
  
  const {getRootProps, getInputProps} = useDropzone({
    multiple: false,
    accept: 'video/*',
    onDrop
  });
 
  return (
    <div {...getRootProps({style: styles.dropzone})}>
      <input {...getInputProps() } />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  );    
};


const processVideo = async (videoFile, videoDuration) => {
  const worker = new Worker();
  const ffmpegjs = await Comlink.proxy(worker);
  console.log(videoFile, videoDuration);
}

 
function App() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [mediaPlayerRef, setMediaPlayer] = useState(null);

  const initiateVideoProcessing = useCallback(async () => {
    setProcessing(true);
    await processVideo(videoFile, videoDuration);
    setProcessing(false);
  }, [videoFile, videoDuration]);

  const mediaPlayerReady = useCallback(() => {
    setVideoDuration(mediaPlayerRef.getDuration());
  }, [mediaPlayerRef]);
  
  return (
    <div className="App">
      <header className="App-header">
	Split Video For Instagram Story
	<div style={styles.container}>
	  <Dropzone setVideoFile={setVideoFile} />
	  { videoFile &&
	    <div style={styles.flexDiv}>
	      <ReactPlayer
		ref={setMediaPlayer}
		url={URL.createObjectURL(videoFile)}
		style={styles.player}
		light controls
		onReady={mediaPlayerReady}
	      />
	      <Button variant="primary" onClick={initiateVideoProcessing}>Submit</Button>
              {processing && <Spinner animation="border" /> }
	    </div>
	  }
	</div>	
      </header>	
    </div>
  );
}

export default App;
