const Stripe = require('stripe');
const env = require('../config/env');

const stripe = env.stripeSecret ? new Stripe(env.stripeSecret) : null;

async function createCheckoutSession({ customerEmail, plan }) {
  if (!stripe) {
    return { id: 'stub-session', url: 'https://stripe.local/mock-checkout' };
  }

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: customerEmail,
    line_items: [{ price: plan, quantity: 1 }],
    success_url: 'http://localhost:5173/?checkout=success',
    cancel_url: 'http://localhost:5173/pricing?checkout=cancel'
  });
}

module.exports = { createCheckoutSession };
