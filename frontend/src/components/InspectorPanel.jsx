import useEditorStore from '../hooks/useEditorStore';

export default function InspectorPanel() {
  const { project, selectedClipId, updateClip, removeClip, splitClip, playhead } = useEditorStore();

  const selected = project.tracks.flatMap((track) => track.clips).find((clip) => clip.id === selectedClipId);

  if (!selected) {
    return (
      <section className="panel">
        <h3>Inspector</h3>
        <p>Select any clip from timeline to edit trim, speed, transition and effects.</p>
      </section>
    );
  }

  return (
    <section className="panel inspector">
      <h3>Inspector</h3>
      <label>
        Clip Name
        <input value={selected.name} onChange={(e) => updateClip(selected.id, { name: e.target.value })} />
      </label>
      <label>
        Start (sec)
        <input type="number" value={selected.start} onChange={(e) => updateClip(selected.id, { start: Number(e.target.value) })} />
      </label>
      <label>
        End (sec)
        <input type="number" value={selected.end} onChange={(e) => updateClip(selected.id, { end: Number(e.target.value) })} />
      </label>
      <label>
        Speed
        <input type="range" min="0.25" max="3" step="0.25" value={selected.speed || 1} onChange={(e) => updateClip(selected.id, { speed: Number(e.target.value) })} />
      </label>
      <div className="toolbar__undo">
        <button type="button" onClick={() => splitClip(selected.id, playhead)}>Split at Playhead</button>
        <button type="button" onClick={() => removeClip(selected.id)}>Delete Clip</button>
      </div>
    </section>
  );
}
