const express = require('express');
const router = express.Router();
const auth = require('../backend/middleware/auth');

router.get('/', auth, async (req, res) => {
    // Code pour récupérer les absences
});

module.exports = router; 