const path = require('path');
const { Worker } = require('worker_threads');

class VideoRenderEngine {
  composeTimeline(timeline) {
    const tracks = timeline?.tracks || [];
    const framePlan = [];
    tracks.forEach((track) => {
      (track.clips || []).forEach((clip) => {
        framePlan.push({
          clipId: clip.id,
          type: clip.type,
          start: clip.start,
          end: clip.end,
          transition: clip.transition || null,
          effects: clip.effects || []
        });
      });
    });
    return framePlan.sort((a, b) => a.start - b.start);
  }

  getAudioMixdownPlan(timeline) {
    const tracks = timeline?.tracks || [];
    const audioClips = tracks.filter((t) => t.type === 'audio').flatMap((t) => t.clips || []);
    return audioClips.map((clip) => ({
      clipId: clip.id,
      start: clip.start,
      end: clip.end,
      gain: clip.gain ?? 1,
      fadeIn: clip.fadeIn ?? 0,
      fadeOut: clip.fadeOut ?? 0
    }));
  }

  spawnRenderWorker(payload, handlers = {}) {
    const workerPath = path.resolve(__dirname, '../collab/workers/renderWorker.js');
    const worker = new Worker(workerPath, {
      workerData: {
        frames: payload.frames,
        compositionPlan: payload.compositionPlan,
        audioMixdownPlan: payload.audioMixdownPlan,
        profile: payload.profile,
        resolution: payload.resolution,
        bitrate: payload.bitrate
      }
    });

    if (handlers.onMessage) worker.on('message', handlers.onMessage);
    if (handlers.onError) worker.on('error', handlers.onError);
    if (handlers.onExit) worker.on('exit', handlers.onExit);

    return worker;
  }
}

module.exports = new VideoRenderEngine();
