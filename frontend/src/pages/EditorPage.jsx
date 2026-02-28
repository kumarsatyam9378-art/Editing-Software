import { useState } from 'react';
import CanvasPreview from '../components/CanvasPreview';
import MediaLibrary from '../components/MediaLibrary';
import PlaybackControls from '../components/PlaybackControls';
import Sidebar from '../components/Sidebar';
import Timeline from '../components/Timeline';
import TopBar from '../components/TopBar';
import useEditorStore from '../hooks/useEditorStore';
import api from '../services/api';
import { trimVideo } from '../utils/ffmpeg';

export default function EditorPage() {
  const { addClip, isPlaying, playhead, duration, togglePlayback, setPlayhead, project } = useEditorStore();
  const [previewUrl, setPreviewUrl] = useState('');

  const handleUpload = (file) => {
    const track = file.type.startsWith('audio') ? 'audio-1' : 'video-1';
    addClip(track, {
      name: file.name,
      start: 0,
      end: 15,
      source: URL.createObjectURL(file),
      type: file.type
    });
  };

  const handleQuickTrim = async () => {
    const videoTrack = project.tracks.find((track) => track.type === 'video');
    const clip = videoTrack?.clips?.[0];
    if (!clip?.source) return;
    const response = await fetch(clip.source);
    const blob = await response.blob();
    const output = await trimVideo(blob, 0, 5);
    setPreviewUrl(output);
  };

  const saveProject = async () => {
    await api.post('/projects', {
      name: project.name,
      composition: project,
      status: 'draft'
    });
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <TopBar title="Editor" />
        <div className="editor-grid">
          <MediaLibrary onFileUpload={handleUpload} />
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
              <button type="button">Export 4K</button>
            </div>
            {previewUrl && <video src={previewUrl} controls className="trim-preview" />}
          </section>
        </div>
        <Timeline />
      </main>
    </div>
  );
}
