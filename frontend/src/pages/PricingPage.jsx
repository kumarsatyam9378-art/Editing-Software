import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

export default function PricingPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get('/subscriptions/plans').then((response) => setPlans(response.data.plans)).catch(() => setPlans([]));
  }, []);

  const checkout = async (planId) => {
    const { data } = await api.post('/subscriptions/checkout', { planPriceId: planId });
    window.open(data.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <h1>Subscription Plans</h1>
        <section className="pricing-grid">
          {plans.map((plan) => (
            <article key={plan.id} className="plan-card">
              <h2>{plan.name}</h2>
              <p>${plan.priceMonthly} / month</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <button type="button" onClick={() => checkout(plan.id)}>Choose {plan.name}</button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
