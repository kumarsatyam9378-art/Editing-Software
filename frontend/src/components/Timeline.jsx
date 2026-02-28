import useEditorStore from '../hooks/useEditorStore';

export default function Timeline() {
  const { project, selectClip, selectedClipId } = useEditorStore();

  return (
    <section className="timeline">
      <h3>Multi-layer Timeline</h3>
      {project.tracks.map((track) => (
        <div key={track.id} className="timeline__track">
          <strong>{track.type.toUpperCase()}</strong>
          <div className="timeline__clips">
            {track.clips.length === 0 ? (
              <span className="clip empty">Drop media here</span>
            ) : (
              track.clips.map((clip) => (
                <button
                  key={clip.id}
                  type="button"
                  className={`clip ${selectedClipId === clip.id ? 'selected' : ''}`}
                  onClick={() => selectClip(clip.id)}
                >
                  {clip.name}
                </button>
              ))
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
