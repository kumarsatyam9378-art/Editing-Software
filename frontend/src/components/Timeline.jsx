import useEditorStore from '../hooks/useEditorStore';

export default function Timeline() {
  const { project, selectClip, selectedClipId, moveClip } = useEditorStore();

  return (
    <section className="timeline">
      <h3>Multi-layer Timeline</h3>
      {project.tracks.map((track) => (
        <div
          key={track.id}
          className="timeline__track"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            const clipId = event.dataTransfer.getData('clip-id');
            if (clipId) moveClip(clipId, track.id);
          }}
        >
          <strong>{track.type.toUpperCase()}</strong>
          <div className="timeline__clips">
            {track.clips.length === 0 ? (
              <span className="clip empty">Drop media here</span>
            ) : (
              track.clips.map((clip) => (
                <button
                  key={clip.id}
                  type="button"
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('clip-id', clip.id)}
                  className={`clip ${selectedClipId === clip.id ? 'selected' : ''}`}
                  onClick={() => selectClip(clip.id)}
                >
                  {clip.name} ({clip.start}s-{clip.end}s)
                </button>
              ))
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
