import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const ffmpeg = new FFmpeg();
let loaded = false;

export async function ensureFFmpegLoaded() {
  if (!loaded) {
    await ffmpeg.load();
    loaded = true;
  }
}

export async function trimVideo(file, start, duration) {
  await ensureFFmpegLoaded();
  await ffmpeg.writeFile('input.mp4', await fetchFile(file));
  await ffmpeg.exec(['-ss', String(start), '-t', String(duration), '-i', 'input.mp4', '-c', 'copy', 'output.mp4']);
  const data = await ffmpeg.readFile('output.mp4');
  return URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}

export async function removeGreenScreen(file) {
  await ensureFFmpegLoaded();
  await ffmpeg.writeFile('greenscreen.mp4', await fetchFile(file));
  await ffmpeg.exec([
    '-i',
    'greenscreen.mp4',
    '-vf',
    'chromakey=0x00FF00:0.2:0.08',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    'vfx-output.mp4'
  ]);
  const data = await ffmpeg.readFile('vfx-output.mp4');
  return URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
}
