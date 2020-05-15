import * as Comlink from "comlink";

import * as ffmpeg from "ffmpeg.js/ffmpeg-mp4";

ffmpeg({
  arguments: ["-version"],
});

Comlink.expose(ffmpeg);
