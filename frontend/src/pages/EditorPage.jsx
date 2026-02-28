import { useEffect, useMemo, useState } from 'react';
import CanvasPreview from '../components/CanvasPreview';
import EffectsPanel from '../components/EffectsPanel';
import InspectorPanel from '../components/InspectorPanel';
import MediaLibrary from '../components/MediaLibrary';
import PlaybackControls from '../components/PlaybackControls';
import Sidebar from '../components/Sidebar';
import Timeline from '../components/Timeline';
import Toolbar from '../components/Toolbar';
import TopBar from '../components/TopBar';
import useEditorStore from '../hooks/useEditorStore';
import api from '../services/api';
import { removeGreenScreen, trimVideo } from '../utils/ffmpeg';

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
  const [isSaving, setIsSaving] = useState(false);
  const [vfxBusy, setVfxBusy] = useState(false);

  const selectedClip = useMemo(
    () => project.tracks.flatMap((track) => track.clips).find((clip) => clip.id === selectedClipId),
    [project, selectedClipId]
  );

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = setInterval(() => {
      setPlayhead(Math.min(duration, playhead + 0.1));
    }, 100);
    return () => clearInterval(timer);
  }, [isPlaying, playhead, setPlayhead, duration]);

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
    await api.post('/projects/export', {
      projectName: project.name,
      target: '4k',
      codec: 'h264'
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
        </div>
        <div className="editor-grid editor-grid--advanced">
          <div>
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
              onCropSelected={() => selectedClipId && updateClip(selectedClipId, { crop: '16:9-safe' })}
            />
            <EffectsPanel onRemoveGreenScreen={handleGreenScreen} processing={vfxBusy} />
          </div>
          <section className="preview-panel">
            <CanvasPreview />
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
              <button type="button" onClick={startExport}>Export 4K</button>
            </div>
            {previewUrl && <video src={previewUrl} controls className="trim-preview" />}
          </section>
          <InspectorPanel />
        </div>
        <Timeline />
      </main>
    </div>
  );
}
