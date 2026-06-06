const express = require('express');
const router  = express.Router();
const { getInfo, getThumbnail } = require('../controllers/metaController');
const { auth } = require('../middleware/auth');

// Auth on all routes
router.use(auth);

// GET /api/info?url=
router.get('/info', getInfo);

// GET /api/thumbnail?url=
router.get('/thumbnail', getThumbnail);

module.exports = router;
