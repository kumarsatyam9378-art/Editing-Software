import { useMemo } from 'react';
import Camera2D from '../editor/core/Camera2D';
import CommandStack from '../editor/core/CommandStack';
import LayerManager from '../editor/layers/LayerManager';
import TimelineEngine from '../editor/timeline/TimelineEngine';
import PlaybackEngine from '../editor/video/PlaybackEngine';
import BrushEngine from '../editor/image/BrushEngine';
import ShapeEngine from '../editor/image/ShapeEngine';
import TextLayoutEngine from '../editor/image/TextLayoutEngine';
import FrameCache from '../editor/video/FrameCache';
import KeyframeEngine from '../editor/animation/KeyframeEngine';
import RenderWorkerClient from '../editor/render/RenderWorkerClient';
import WaveformEngine from '../editor/audio/WaveformEngine';
import AudioScrubEngine from '../editor/audio/AudioScrubEngine';
import AudioMixerEngine from '../editor/audio/AudioMixerEngine';
import AnimationGraphEngine from '../editor/animation/AnimationGraphEngine';

export default function useEditorEngines({ fps, duration }) {
  return useMemo(() => {
    const camera = new Camera2D();
    const commands = new CommandStack(300);
    const layers = new LayerManager();
    const timeline = new TimelineEngine({ fps, durationFrames: Math.round(fps * duration) });
    const playback = new PlaybackEngine({ fps, duration });
    const brush = new BrushEngine();
    const shapes = new ShapeEngine();
    const text = new TextLayoutEngine();
    const frameCache = new FrameCache(240);
    const keyframes = new KeyframeEngine();
    const renderWorker = new RenderWorkerClient();
    const waveform = new WaveformEngine();
    const audioScrub = new AudioScrubEngine();
    const audioMixer = new AudioMixerEngine();
    const animationGraph = new AnimationGraphEngine();

    return {
      camera,
      commands,
      layers,
      timeline,
      playback,
      brush,
      shapes,
      text,
      frameCache,
      keyframes,
      renderWorker,
      waveform,
      audioScrub,
      audioMixer,
      animationGraph
    };
  }, [fps, duration]);
}
