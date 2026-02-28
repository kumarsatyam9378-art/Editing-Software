import { useMemo, useState } from 'react';

const borderCategories = {
  romantic: ['Romantic Rose', 'Love Neon', 'Wedding Glow'],
  floral: ['Floral Soft', 'Floral Gold', 'Floral Bloom'],
  vintage: ['Vintage Film', 'Retro Dust', 'Classic Matte'],
  minimal: ['Clean White', 'Thin Black', 'Minimal Silver'],
  cinematic: ['Scope Frame', 'Cinema Grain', 'Anamorphic Glow'],
  gaming: ['RGB Edge', 'Cyber Grid', 'HUD Frame'],
  birthday: ['Party Pop', 'Confetti Ring', 'Balloon Frame'],
  festival: ['Diwali Spark', 'Holi Splash', 'New Year Flash']
};

export default function BorderMarketplace({ onApplyBorder }) {
  const categories = useMemo(() => Object.keys(borderCategories), []);
  const [activeCategory, setActiveCategory] = useState('romantic');

  return (
    <section className="panel panel-scroll">
      <h3>Border Marketplace</h3>
      <div className="chip-row">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`chip ${activeCategory === category ? 'chip--active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="border-grid">
        {borderCategories[activeCategory].map((borderName) => (
          <button
            key={borderName}
            type="button"
            className="border-card"
            onClick={() => onApplyBorder({ category: activeCategory, name: borderName })}
          >
            <span>{borderName}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
