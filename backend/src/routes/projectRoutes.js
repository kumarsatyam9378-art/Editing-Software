const express = require('express');
const { createProject, listProjects } = require('../controllers/projectController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, listProjects);
router.post('/', auth, createProject);

module.exports = router;
