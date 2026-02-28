import Sidebar from '../components/Sidebar';

const plans = [
  { name: 'Free', price: '$0', features: ['720p export', 'Basic timeline', '1 project'] },
  { name: 'Pro', price: '$29', features: ['4K export', 'Unlimited projects', 'Advanced transitions'] },
  { name: 'Studio', price: '$99', features: ['Team workspace', 'Priority rendering', 'Premium VFX'] }
];

export default function PricingPage() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <h1>Subscription Plans</h1>
        <section className="pricing-grid">
          {plans.map((plan) => (
            <article key={plan.name} className="plan-card">
              <h2>{plan.name}</h2>
              <p>{plan.price} / month</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <button type="button">Choose {plan.name}</button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
