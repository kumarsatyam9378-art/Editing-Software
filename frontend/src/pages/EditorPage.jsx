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
  }, [playhead, engines.playback]);

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
            </div>
            <p>Background Render Progress: {renderProgress}%</p>
            {previewUrl && <video ref={previewVideoRef} src={previewUrl} controls className="trim-preview" />}
          </section>
          <div className="panel-stack">
            <InspectorPanel />
            <VideoToolsPanel />
          </div>
        </div>
        <Timeline />
      </main>
    </div>
  );
}
