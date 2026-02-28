export default function PlaybackControls({ isPlaying, onPlayPause, onSeek, playhead, duration }) {
  return (
    <div className="playback-controls">
      <button type="button" onClick={onPlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <input
        type="range"
        min={0}
        max={duration}
        value={playhead}
        onChange={(event) => onSeek(Number(event.target.value))}
      />
      <span>{playhead.toFixed(1)}s / {duration}s</span>
    </div>
  );
}
