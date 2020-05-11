import * as Comlink from 'comlink';

import * as ffmpeg from 'ffmpeg.js/ffmpeg-mp4';

console.log({ ffmpeg });
const result = ffmpeg({
  arguments: ['-version']
});

console.log({ result });


Comlink.expose(ffmpeg);
