const express = require('express');
const router = express.Router();
const Store = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, (req, res) => {
  try {
    Store.resetAll();
    res.json({ success: true, message: 'Database reset to default seed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
