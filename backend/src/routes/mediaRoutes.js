const express = require('express');
const auth = require('../middleware/auth');
const { requestUpload } = require('../controllers/mediaController');

const router = express.Router();

router.post('/upload-url', auth, requestUpload);

module.exports = router;
