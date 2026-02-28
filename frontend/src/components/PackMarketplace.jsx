import { effectBundles, lutPacks, transitionPacks } from '../marketplace/packs';

export default function PackMarketplace({ onApplyPack }) {
  const renderPack = (title, packs, keyName) => (
    <section>
      <h4>{title}</h4>
      <div className="tool-matrix">
        {packs.map((pack) => (
          <article key={pack.id} className="tool-card">
            <strong>{pack.name}</strong>
            <ul>
              {pack[keyName].map((item) => <li key={item}>{item}</li>)}
            </ul>
            <button type="button" onClick={() => onApplyPack(pack)}>Apply Pack</button>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <section className="panel panel-scroll">
      <h3>Marketplace Packs</h3>
      {renderPack('Transition Packs', transitionPacks, 'transitions')}
      {renderPack('LUT Packs', lutPacks, 'luts')}
      {renderPack('Effect Bundles', effectBundles, 'effects')}
    </section>
  );
}
