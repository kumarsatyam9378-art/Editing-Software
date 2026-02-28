import useEditorStore from '../hooks/useEditorStore';

const tools = [
  { id: 'select', label: 'Select' },
  { id: 'text', label: 'Text' },
  { id: 'trim', label: 'Trim' },
  { id: 'split', label: 'Split' },
  { id: 'crop', label: 'Crop' },
  { id: 'chroma', label: 'Green Screen' },
  { id: 'filter', label: 'Filters' },
  { id: 'transition', label: 'Transitions' }
];

export default function Toolbar({ onAddTextOverlay, onApplyTransition, onApplyFilter, onCropSelected }) {
  const { activeTool, setActiveTool, undo, redo, history, future, selectedClipId } = useEditorStore();

  return (
    <section className="panel toolbar">
      <h3>Editor Tools</h3>
      <div className="toolbar__grid">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={activeTool === tool.id ? 'active' : ''}
            onClick={() => setActiveTool(tool.id)}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <div className="toolbar__actions">
        <button type="button" disabled={!selectedClipId} onClick={onAddTextOverlay}>Add Text Overlay</button>
        <button type="button" disabled={!selectedClipId} onClick={onApplyFilter}>Apply Cinematic Filter</button>
        <button type="button" disabled={!selectedClipId} onClick={onApplyTransition}>Add Fade Transition</button>
        <button type="button" disabled={!selectedClipId} onClick={onCropSelected}>Crop 16:9 Safe</button>
      </div>
      <div className="toolbar__undo">
        <button type="button" disabled={history.length === 0} onClick={undo}>Undo</button>
        <button type="button" disabled={future.length === 0} onClick={redo}>Redo</button>
      </div>
    </section>
  );
}
