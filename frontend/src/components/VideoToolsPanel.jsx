const tools = [
  { group: 'Playback', items: ['Play/Pause', 'Frame Prev/Next', 'Loop', 'Volume 0-200%'] },
  { group: 'Speed', items: ['0.1x-16x', 'Reverse', 'Freeze Frame'] },
  { group: 'Trim', items: ['In/Out', 'Split', 'Jump to Time'] },
  { group: 'Adjust', items: ['Brightness', 'Contrast', 'Vibrance', 'Shadows/Highlights'] },
  { group: 'Color', items: ['15 LUT Presets', 'Temperature', 'Tint', 'RGB Mixer'] },
  { group: 'Filter', items: ['18 Filters + Intensity'] },
  { group: 'Effects', items: ['Blur', 'VHS', 'Glitch', 'RGB Split', 'Shake'] },
  { group: 'Transitions', items: ['Fade', 'Slide', 'Zoom', 'Flash', 'Spin', 'Dissolve'] },
  { group: 'Text', items: ['Styles', 'Animations', 'Position XY'] },
  { group: 'Audio', items: ['EQ', 'Fade In/Out', 'Keyframe Volume', 'Scrub'] },
  { group: 'Crop/Transform', items: ['Aspect Ratios', 'Rotate', 'Scale', 'Move'] },
  { group: 'Overlay', items: ['Rain', 'Snow', 'Bokeh', 'Fire', 'Confetti'] }
];

export default function VideoToolsPanel() {
  return (
    <section className="panel panel-scroll">
      <h3>CapCut-style Tool Matrix</h3>
      <div className="tool-matrix">
        {tools.map((tool) => (
          <article key={tool.group} className="tool-card">
            <h4>{tool.group}</h4>
            <ul>
              {tool.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
