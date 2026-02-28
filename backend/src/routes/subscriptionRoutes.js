const express = require('express');
const auth = require('../middleware/auth');
const { startCheckout, listPlans } = require('../controllers/subscriptionController');

const router = express.Router();

router.get('/plans', listPlans);
router.post('/checkout', auth, startCheckout);

module.exports = router;
