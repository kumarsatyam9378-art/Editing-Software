import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

export default function PricingPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get('/subscriptions/plans').then((response) => setPlans(response.data.plans)).catch(() => setPlans([]));
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <h1>Subscription Plans</h1>
        <p>Login removed for now. Plans visible publicly; checkout API can be re-enabled with auth later.</p>
        <section className="pricing-grid">
          {plans.map((plan) => (
            <article key={plan.id} className="plan-card">
              <h2>{plan.name}</h2>
              <p>${plan.priceMonthly} / month</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <button type="button" disabled>Checkout Coming Soon</button>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
