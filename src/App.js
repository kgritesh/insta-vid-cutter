
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
import {formatTime} from './utils';

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
  const worker = new Worker("./worker.js");
  const ffmpeg = await Comlink.wrap(worker);
  console.log("Ffmpeg", ffmpeg);
  const fileContent = await videoFile.arrayBuffer();  
  let results = [];
  let counter = 1;
  const [videoName, ext] = videoFile.name.split(".");
  console.log(videoFile, videoDuration, videoName, ext);
  for(let i = 0; i < videoDuration; i += 15) {
    const startTime = formatTime(i);
    const endTime = formatTime(i + 15);
    const outputFileName = `${videoName}-${counter}.${ext}`
    const result = await ffmpeg({
      MEMFS: [{ name: videoFile.name, data: fileContent }],
      arguments: ["-i", videoFile.name, "-ss", startTime, "-to", endTime, "-c", "copy", outputFileName] 
    });
    console.log(result);
    const outputFile = result.MEMFS[0];
    console.log(`Processed from ${startTime} to ${endTime}`);
    saveFile(outputFile.name, new Blob([outputFile.data]));
    counter += 1;
  }
  return results;  
}

function saveFile (name, blob) {
  if (blob !== null && navigator.msSaveBlob) {    
    return navigator.msSaveBlob(new Blob(blob), name);
  }
 
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("style", 'display: none;');
  a.setAttribute('href', url);
  a.setAttribute('download', name);
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);  
  document.body.removeChild(a);
}



// const processVideo = async () => {
//   const worker = new Worker("./worker.js");
//   const obj = await Comlink.wrap(worker);
//   await obj.inc();
//   console.log(`Obj count is ${await obj.count}`);
// }
 
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
    console.log("Media Player Ready", mediaPlayerRef.getDuration());
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
