export default class TimeMappingEngine {
  mapTimelineFrameToSourceFrame(clip, timelineFrame) {
    const relative = Math.max(0, timelineFrame - clip.startFrame);
    const speed = clip.speed || 1;
    return Math.round((clip.sourceStartFrame || 0) + relative * speed);
  }

  buildSpeedRampLookup(clip, endFrame) {
    const keyframes = clip.speedKeyframes || [{ frame: clip.startFrame, speed: clip.speed || 1 }];
    const lookup = [];
    let cumulative = clip.sourceStartFrame || 0;

    for (let frame = clip.startFrame; frame <= endFrame; frame += 1) {
      let speed = keyframes[keyframes.length - 1].speed;
      for (let i = 0; i < keyframes.length - 1; i += 1) {
        const a = keyframes[i];
        const b = keyframes[i + 1];
        if (frame >= a.frame && frame <= b.frame) {
          const t = (frame - a.frame) / Math.max(1, b.frame - a.frame);
          speed = a.speed + (b.speed - a.speed) * t;
          break;
        }
      }
      cumulative += speed;
      lookup[frame] = Math.round(cumulative);
    }

    return lookup;
  }
}
