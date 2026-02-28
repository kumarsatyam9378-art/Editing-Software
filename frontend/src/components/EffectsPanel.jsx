export default function EffectsPanel({ onRemoveGreenScreen, processing }) {
  return (
    <section className="panel">
      <h3>Effects & VFX</h3>
      <ul className="effects-list">
        <li>Color LUT (cinematic look)</li>
        <li>Transition preset (fade)</li>
        <li>Motion text animation</li>
        <li>Green screen keying</li>
      </ul>
      <button type="button" onClick={onRemoveGreenScreen} disabled={processing}>
        {processing ? 'Processing...' : 'Apply Green Screen Removal'}
      </button>
    </section>
  );
}
