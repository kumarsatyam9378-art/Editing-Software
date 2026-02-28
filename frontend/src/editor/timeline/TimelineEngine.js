import { createTimelineState, framesToSeconds, secondsToFrames } from './core/TimelineState';
import TrackManager from './core/TrackManager';
import ClipGraph from './core/ClipGraph';
import SnapEngine from './core/SnapEngine';
import RippleEngine from './core/RippleEngine';
import TimeMappingEngine from './core/TimeMappingEngine';
import HistoryStack from './core/HistoryStack';
import SelectionManager from './core/SelectionManager';
import Serializer from './core/Serializer';
import PlaybackController from './core/PlaybackController';
import MarkerManager from './core/MarkerManager';

export default class TimelineEngine {
  constructor({ fps = 30, durationFrames = 30 * 60 } = {}) {
    this.state = createTimelineState({ fps, durationFrames });
    this.tracks = new TrackManager(this.state);
    this.clipGraph = new ClipGraph(this.state);
    this.snap = new SnapEngine(this.state);
    this.ripple = new RippleEngine(this.state);
    this.timeMapping = new TimeMappingEngine();
    this.history = new HistoryStack(500);
    this.selection = new SelectionManager();
    this.serializer = new Serializer();
    this.playbackController = new PlaybackController(this.state);
    this.markerManager = new MarkerManager(this.state);
  }

  setTracks(tracks) {
    this.state.tracks = tracks.map((track) => ({
      ...track,
      clips: (track.clips || []).map((clip) => ({
        ...clip,
        startFrame: clip.startFrame ?? secondsToFrames(clip.start || 0, this.state.fps),
        endFrame: clip.endFrame ?? secondsToFrames(clip.end || 0, this.state.fps),
        sourceStartFrame: clip.sourceStartFrame ?? 0,
        sourceEndFrame: clip.sourceEndFrame ?? secondsToFrames((clip.end || 0) - (clip.start || 0), this.state.fps),
        speed: clip.speed || 1,
        keyframes: clip.keyframes || {}
      }))
    }));
    this.clipGraph.rebuild();
  }

  getState() {
    return this.state;
  }

  setPlayheadFrame(frame) {
    this.state.playheadFrame = Math.max(0, Math.min(this.state.durationFrames, frame));
  }

  addMarker(frame, label = 'Marker') {
    this.markerManager.add(frame, label);
  }

  trimClip(clipId, startFrame, endFrame, ripple = false) {
    const found = this.clipGraph.getClip(clipId);
    if (!found) return null;

    const snappedStart = startFrame + this.snap.getSnapOffset(startFrame);
    const snappedEnd = endFrame + this.snap.getSnapOffset(endFrame);
    const old = { startFrame: found.clip.startFrame, endFrame: found.clip.endFrame };

    found.clip.startFrame = Math.max(0, Math.min(snappedStart, snappedEnd - 1));
    found.clip.endFrame = Math.max(found.clip.startFrame + 1, snappedEnd);

    if (ripple) {
      const delta = found.clip.endFrame - old.endFrame;
      if (delta !== 0) this.ripple.rippleFrom(old.endFrame, delta);
    }

    this.history.pushDiff({
      type: 'trim',
      clipId,
      before: old,
      after: { startFrame: found.clip.startFrame, endFrame: found.clip.endFrame }
    });

    this.clipGraph.rebuild();
    return found.clip;
  }

  splitClip(clipId, atFrame) {
    const found = this.clipGraph.getClip(clipId);
    if (!found) return null;
    if (atFrame <= found.clip.startFrame || atFrame >= found.clip.endFrame) return null;

    const left = { ...found.clip, id: crypto.randomUUID(), endFrame: atFrame };
    const right = { ...found.clip, id: crypto.randomUUID(), startFrame: atFrame };

    found.track.clips = found.track.clips.filter((c) => c.id !== clipId).concat(left, right);
    this.history.pushDiff({ type: 'split', clipId, left, right });
    this.clipGraph.rebuild();
    return [left, right];
  }

  rippleDelete(clipId) {
    const found = this.clipGraph.getClip(clipId);
    if (!found) return false;
    const delta = found.clip.endFrame - found.clip.startFrame;
    const deleteFrom = found.clip.endFrame;

    found.track.clips = found.track.clips.filter((c) => c.id !== clipId);
    this.ripple.rippleFrom(deleteFrom, -delta);
    this.history.pushDiff({ type: 'ripple-delete', clip: found.clip, delta });
    this.clipGraph.rebuild();
    return true;
  }

  moveClip(clipId, toTrackId, newStartFrame) {
    const found = this.clipGraph.getClip(clipId);
    const targetTrack = this.tracks.getTrack(toTrackId);
    if (!found || !targetTrack || targetTrack.locked) return false;

    const duration = found.clip.endFrame - found.clip.startFrame;
    const snappedStart = newStartFrame + this.snap.getSnapOffset(newStartFrame);
    const snappedEnd = snappedStart + duration;

    const collisions = this.clipGraph.overlaps(snappedStart, snappedEnd, clipId).filter((clip) => clip.trackId === toTrackId);
    if (collisions.length) return false;

    found.track.clips = found.track.clips.filter((c) => c.id !== clipId);
    const moved = { ...found.clip, trackId: toTrackId, startFrame: snappedStart, endFrame: snappedEnd };
    targetTrack.clips.push(moved);

    this.history.pushDiff({ type: 'move', clipId, toTrackId, newStartFrame: snappedStart });
    this.clipGraph.rebuild();
    return true;
  }

  mapToSourceFrame(clip, timelineFrame) {
    return this.timeMapping.mapTimelineFrameToSourceFrame(clip, timelineFrame);
  }

  buildSpeedRamp(clip) {
    return this.timeMapping.buildSpeedRampLookup(clip, clip.endFrame);
  }

  serialize() {
    return this.serializer.save(this.state);
  }

  deserialize(raw) {
    this.state = this.serializer.load(raw);
    this.tracks = new TrackManager(this.state);
    this.clipGraph = new ClipGraph(this.state);
    this.snap = new SnapEngine(this.state);
    this.ripple = new RippleEngine(this.state);
    this.playbackController = new PlaybackController(this.state);
    this.markerManager = new MarkerManager(this.state);
    this.clipGraph.rebuild();
  }

  getAllClips() {
    return this.state.tracks.flatMap((track) => track.clips || []).map((clip) => ({
      ...clip,
      start: framesToSeconds(clip.startFrame, this.state.fps),
      end: framesToSeconds(clip.endFrame, this.state.fps)
    }));
  }
}
