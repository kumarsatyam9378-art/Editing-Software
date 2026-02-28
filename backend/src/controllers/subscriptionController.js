const { createCheckoutSession } = require('../services/stripeService');

async function startCheckout(req, res) {
  const session = await createCheckoutSession({
    customerEmail: req.user.email,
    plan: req.body.planPriceId
  });

  return res.json({ url: session.url, sessionId: session.id });
}

module.exports = { startCheckout };
