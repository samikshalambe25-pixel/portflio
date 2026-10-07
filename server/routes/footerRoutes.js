const express = require('express');
const router = express.Router();
const Store = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  const data = Store.getFooter();
  res.json({ success: true, data });
});

router.put('/', authMiddleware, (req, res) => {
  try {
    const updated = Store.updateFooter(req.body);
    res.json({ success: true, data: updated, message: 'Footer updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const updated = Store.updateFooter(req.body);
    res.json({ success: true, data: updated, message: 'Footer updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
