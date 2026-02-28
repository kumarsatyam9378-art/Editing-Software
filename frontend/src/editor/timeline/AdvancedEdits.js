export function rippleDelete(track, clipId) {
  const idx = track.clips.findIndex((clip) => clip.id === clipId);
  if (idx === -1) return track;
  const target = track.clips[idx];
  const delta = target.end - target.start;
  const remaining = track.clips.filter((clip) => clip.id !== clipId).map((clip) => {
    if (clip.start >= target.end) {
      return { ...clip, start: clip.start - delta, end: clip.end - delta };
    }
    return clip;
  });
  return { ...track, clips: remaining };
}

export function rollEdit(leftClip, rightClip, pivot, minDuration = 0.1) {
  if (!leftClip || !rightClip) return [leftClip, rightClip];
  const leftStart = leftClip.start;
  const rightEnd = rightClip.end;
  const nextPivot = Math.max(leftStart + minDuration, Math.min(rightEnd - minDuration, pivot));
  return [
    { ...leftClip, end: nextPivot },
    { ...rightClip, start: nextPivot }
  ];
}

export function slipEdit(clip, delta) {
  const srcIn = clip.sourceIn || 0;
  const srcOut = clip.sourceOut || (clip.end - clip.start);
  return {
    ...clip,
    sourceIn: Math.max(0, srcIn + delta),
    sourceOut: Math.max(srcIn + delta + 0.1, srcOut + delta)
  };
}

export function slideEdit(prevClip, clip, nextClip, delta) {
  if (!prevClip || !clip || !nextClip) return [prevClip, clip, nextClip];
  const moved = { ...clip, start: clip.start + delta, end: clip.end + delta };
  const adjustedPrev = { ...prevClip, end: moved.start };
  const adjustedNext = { ...nextClip, start: moved.end };
  return [adjustedPrev, moved, adjustedNext];
}

export function linkAudioVideo(videoClip, audioClip) {
  const groupId = crypto.randomUUID();
  return [
    { ...videoClip, linkedGroupId: groupId },
    { ...audioClip, linkedGroupId: groupId }
  ];
}

export function createNestedSequence(name, clips) {
  const start = Math.min(...clips.map((clip) => clip.start));
  const end = Math.max(...clips.map((clip) => clip.end));
  return {
    id: crypto.randomUUID(),
    name,
    type: 'nested-sequence',
    start,
    end,
    clips
  };
}
