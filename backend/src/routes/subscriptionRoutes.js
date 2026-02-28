const express = require('express');
const auth = require('../middleware/auth');
const { startCheckout } = require('../controllers/subscriptionController');

const router = express.Router();

router.post('/checkout', auth, startCheckout);

module.exports = router;
