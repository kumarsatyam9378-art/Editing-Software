const { createCheckoutSession } = require('../services/stripeService');

const plans = [
  {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    features: ['1 project', '720p export', 'basic transitions']
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 29,
    features: ['unlimited projects', '4k export', 'advanced effects']
  },
  {
    id: 'studio',
    name: 'Studio',
    priceMonthly: 99,
    features: ['team workspace', 'priority rendering', 'premium VFX presets']
  }
];

async function listPlans(req, res) {
  return res.json({ plans });
}

async function startCheckout(req, res) {
  const session = await createCheckoutSession({
    customerEmail: req.user.email,
    plan: req.body.planPriceId
  });

  return res.json({ url: session.url, sessionId: session.id });
}

module.exports = { startCheckout, listPlans };
