import { useEffect, useMemo, useRef, useState } from 'react';
import BorderMarketplace from '../components/BorderMarketplace';
import CanvasPreview from '../components/CanvasPreview';
import EffectsPanel from '../components/EffectsPanel';
import InspectorPanel from '../components/InspectorPanel';
import MediaLibrary from '../components/MediaLibrary';
import PlaybackControls from '../components/PlaybackControls';
import Sidebar from '../components/Sidebar';
import Timeline from '../components/Timeline';
import Toolbar from '../components/Toolbar';
import TopBar from '../components/TopBar';
import VideoToolsPanel from '../components/VideoToolsPanel';
import PackMarketplace from '../components/PackMarketplace';
import useEditorStore from '../hooks/useEditorStore';
import api from '../services/api';
import { removeGreenScreen, trimVideo } from '../utils/ffmpeg';
import useEditorEngines from '../hooks/useEditorEngines';
import { rippleDelete } from '../editor/timeline/AdvancedEdits';
import { downloadBlob, exportPreviewElement } from '../editor/image/ImageExportEngine';

export default function EditorPage() {
  const {
    addClip,
    isPlaying,
    playhead,
    duration,
    togglePlayback,
    setPlayhead,
    project,
    selectedClipId,
    updateClip,
    setProjectZoom,
    setProjectName
  } = useEditorStore();

  const [previewUrl, setPreviewUrl] = useState('');
  const [activeBorder, setActiveBorder] = useState(null);
  const previewVideoRef = useRef(null);
  const engines = useEditorEngines({ fps: project.fps, duration });
  const [isSaving, setIsSaving] = useState(false);
  const [vfxBusy, setVfxBusy] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const playheadFrame = Math.round(playhead * project.fps);

  const selectedClip = useMemo(
    () => project.tracks.flatMap((track) => track.clips).find((clip) => clip.id === selectedClipId),
    [project, selectedClipId]
  );

  useEffect(() => {
    engines.timeline.setTracks(project.tracks);
  }, [engines.timeline, project.tracks]);

  useEffect(() => {
    const dispose = engines.playback.onTick((time) => {
      setPlayhead(time);
      engines.audioScrub.scrubTo(time);
    });
    return dispose;
  }, [engines.playback, engines.audioScrub, setPlayhead]);

  useEffect(() => {
    if (isPlaying) engines.playback.play();
    else engines.playback.pause();
  }, [isPlaying, engines.playback]);

  useEffect(() => {
    engines.playback.seek(playhead);
    engines.timeline.setPlayheadFrame(playheadFrame);
  }, [playhead, playheadFrame, engines.playback, engines.timeline]);

  useEffect(() => {
    const off = engines.renderWorker.onEvent((event) => {
      if (event.type === 'progress') setRenderProgress(event.progress);
      if (event.type === 'completed') setPreviewUrl(event.output);
    });

    return () => {
      off();
      engines.renderWorker.dispose();
    };
  }, [engines.renderWorker]);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!project?.name) return;
      try {
        setIsSaving(true);
        await api.post('/projects/upsert', {
          name: project.name,
          composition: project,
          status: 'draft'
        });
      } catch (error) {
        console.error('Autosave failed', error.message);
      } finally {
        setIsSaving(false);
      }
    }, 2500);

    return () => clearTimeout(id);
  }, [project]);

  const handleUpload = (file) => {
    let track = 'video-1';
    if (file.type.startsWith('audio')) track = 'audio-1';
    if (file.type.startsWith('image')) track = 'overlay-1';

    addClip(track, {
      name: file.name,
      start: 0,
      end: 15,
      source: URL.createObjectURL(file),
      type: file.type,
      speed: 1,
      transition: null,
      filter: null,
      crop: null
    });
  };

  const handleQuickTrim = async () => {
    if (!selectedClip?.source) return;
    const response = await fetch(selectedClip.source);
    const blob = await response.blob();
    const output = await trimVideo(blob, 0, 5);
    setPreviewUrl(output);
  };

  const handleGreenScreen = async () => {
    if (!selectedClip?.source) return;
    setVfxBusy(true);
    try {
      const response = await fetch(selectedClip.source);
      const blob = await response.blob();
      const output = await removeGreenScreen(blob);
      setPreviewUrl(output);
      updateClip(selectedClip.id, { effect: 'chroma-key' });
    } finally {
      setVfxBusy(false);
    }
  };

  const saveProject = async () => {
    await api.post('/projects/upsert', {
      name: project.name,
      composition: project,
      status: 'draft'
    });
  };

  const startExport = async () => {
    engines.renderWorker.renderFrames({ frames: project.fps * duration, batch: 30 });
    await api.post('/projects/export', {
      projectName: project.name,
      target: '4k',
      codec: 'h264'
    });
  };

  const exportStill = async (preset, format) => {
    if (!previewVideoRef.current) return;
    const blob = await exportPreviewElement(previewVideoRef.current, { preset, format, quality: 0.95 });
    downloadBlob(blob, `satyam-studio-${preset}.${format.split('/')[1]}`);
  };

  const handleRippleDelete = () => {
    const firstTrack = project.tracks[0];
    const firstClip = firstTrack?.clips?.[0];
    if (!firstTrack || !firstClip) return;
    const updatedTrack = rippleDelete(firstTrack, firstClip.id);
    updatedTrack.clips.forEach((clip) => updateClip(clip.id, clip));
  };


  const applyPack = (pack) => {
    if (!selectedClipId) return;
    if (pack.transitions) updateClip(selectedClipId, { transitionPack: pack.id, transition: pack.transitions[0] });
    if (pack.effects) updateClip(selectedClipId, { effectPack: pack.id, effects: pack.effects });
    if (pack.luts) updateClip(selectedClipId, { lutPack: pack.id, lut: pack.luts[0] });
  };


  const demoNodeAnimationGraph = () => {
    const graph = engines.animationGraph;
    graph.nodes.clear();

    const time = graph.addNode('time');
    const noise = graph.addNode('noise', { amplitude: 0.4, frequency: 0.09 });
    const base = graph.addNode('constant', { value: 0.6 });
    const add = graph.addNode('add');
    const spring = graph.addNode('spring', { stiffness: 180, damping: 20, mass: 1 });
    const clamp = graph.addNode('clamp', { min: 0, max: 1 });
    const out = graph.addNode('output', { property: 'opacity' });

    graph.connect(noise.id, 't', time.id, 'value');
    graph.connect(add.id, 'a', base.id, 'value');
    graph.connect(add.id, 'b', noise.id, 'value');
    graph.connect(spring.id, 'target', add.id, 'value');
    graph.connect(clamp.id, 'v', spring.id, 'value');
    graph.connect(out.id, 'value', clamp.id, 'value');

    const evaluated = graph.evaluate(playheadFrame, project.fps);
    if (selectedClipId && evaluated.opacity != null) {
      updateClip(selectedClipId, { opacity: Number(evaluated.opacity.toFixed(3)), animationGraph: graph.serialize() });
    }
  };

  const demoAudioMix = () => {
    const samples = new Float32Array(48000).map((_, i) => Math.sin((i / 48000) * Math.PI * 16));
    engines.audioMixer.mixdown([
      { samples, options: { durationSec: 1, fadeInSec: 0.1, fadeOutSec: 0.15, lowGain: 1.1, midGain: 0.95, highGain: 1.05, volumeKeyframes: [{ time: 0, value: 0.7 }, { time: 0.5, value: 1 }, { time: 1, value: 0.8 }] } }
    ]);
  };


  const syncStoreFromTimeline = () => {
    const timelineTracks = engines.timeline.getState().tracks;
    timelineTracks.forEach((track) => {
      track.clips.forEach((clip) => {
        updateClip(clip.id, {
          startFrame: clip.startFrame,
          endFrame: clip.endFrame,
          start: clip.startFrame / project.fps,
          end: clip.endFrame / project.fps
        });
      });
    });
  };

  const splitAtPlayhead = () => {
    if (!selectedClipId) return;
    engines.timeline.splitClip(selectedClipId, playheadFrame);
    syncStoreFromTimeline();
  };

  const addMarkerAtPlayhead = () => {
    engines.timeline.addMarker(playheadFrame, `M-${playheadFrame}`);
  };

  const setOpacityKeyframe = () => {
    if (!selectedClipId) return;
    engines.keyframes.addKeyframe(selectedClipId, 'opacity', {
      time: playhead,
      value: 1,
      interpolation: 'bezier',
      easing: { x1: 0.42, y1: 0, x2: 0.58, y2: 1 }
    });
    engines.keyframes.addKeyframe(selectedClipId, 'opacity', {
      time: Math.min(duration, playhead + 1),
      value: 0.6,
      interpolation: 'linear'
    });
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <TopBar title="Editor" />
        <div className="editor-header-row">
          <input
            className="project-name"
            value={project.name}
            onChange={(e) => setProjectName(e.target.value)}
            aria-label="Project name"
          />
          <label>
            Zoom
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              value={project.zoom}
              onChange={(e) => setProjectZoom(Number(e.target.value))}
            />
          </label>
          <span>{isSaving ? 'Autosaving...' : 'All changes saved'}</span>
          <span>Engine: {engines.timeline.getAllClips().length} clips | Frame {engines.playback.getCurrentFrame()}</span>
          <span>Render: {renderProgress}%</span>
          <span>Industrial Timeline: frame {playheadFrame}, markers {engines.timeline.getState().markers.length}</span>
        </div>
        <div className="editor-grid editor-grid--advanced">
          <div className="panel-stack">
            <MediaLibrary onFileUpload={handleUpload} />
            <Toolbar
              onAddTextOverlay={() =>
                addClip('text-1', {
                  name: 'Animated Title',
                  start: playhead,
                  end: playhead + 5,
                  text: 'Your cinematic headline',
                  animation: 'slide-up',
                  type: 'text/plain'
                })
              }
              onApplyFilter={() => selectedClipId && updateClip(selectedClipId, { filter: 'cinematic-lut' })}
              onApplyTransition={() => selectedClipId && updateClip(selectedClipId, { transition: 'fade' })}
              onCropSelected={() => selectedClipId && updateClip(selectedClipId, { crop: '9:16' })}
            />
            <EffectsPanel onRemoveGreenScreen={handleGreenScreen} processing={vfxBusy} />
            <BorderMarketplace onApplyBorder={setActiveBorder} />
          </div>
          <section className="preview-panel">
            <CanvasPreview />
            {activeBorder && <p>Active border: {activeBorder.category} / {activeBorder.name}</p>}
            <PlaybackControls
              isPlaying={isPlaying}
              onPlayPause={togglePlayback}
              onSeek={setPlayhead}
              playhead={playhead}
              duration={duration}
            />
            <div className="editor-actions">
              <button type="button" onClick={handleQuickTrim}>Trim 0-5s</button>
              <button type="button" onClick={saveProject}>Cloud Save Project</button>
              <button type="button" onClick={startExport}>Export 4K Video</button>
              <button type="button" onClick={handleRippleDelete}>Ripple Delete 1st Clip</button>
              <button type="button" onClick={setOpacityKeyframe}>Set Opacity Keyframes</button>
              <button type="button" onClick={() => exportStill('4k', 'image/png')}>Save PNG 4K</button>
              <button type="button" onClick={() => exportStill('8k', 'image/webp')}>Save WebP 8K</button>
              <button type="button" onClick={demoAudioMix}>Audio Mix Demo</button>
              <button type="button" onClick={demoNodeAnimationGraph}>Node Animation Graph Demo</button>
              <button type="button" onClick={splitAtPlayhead}>Split @ Playhead(Frame)</button>
              <button type="button" onClick={addMarkerAtPlayhead}>Add Marker</button>
            </div>
            <p>Background Render Progress: {renderProgress}%</p>
            {previewUrl && <video ref={previewVideoRef} src={previewUrl} controls className="trim-preview" />}
          </section>
          <div className="panel-stack">
            <InspectorPanel />
            <VideoToolsPanel />
            <PackMarketplace onApplyPack={applyPack} />
          </div>
        </div>
        <Timeline />
      </main>
    </div>
  );
}
