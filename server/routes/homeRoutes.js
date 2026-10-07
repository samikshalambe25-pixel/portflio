const express = require('express');
const router = express.Router();
const Store = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  const data = Store.getHome();
  res.json({ success: true, data });
});

router.put('/', authMiddleware, (req, res) => {
  try {
    const updated = Store.updateHome(req.body);
    res.json({ success: true, data: updated, message: 'Home section updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
