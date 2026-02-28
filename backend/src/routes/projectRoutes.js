const express = require('express');
const { createProject, listProjects, upsertProject, createExportJob } = require('../controllers/projectController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, listProjects);
router.post('/', auth, createProject);
router.post('/upsert', auth, upsertProject);
router.post('/export', auth, createExportJob);

module.exports = router;
