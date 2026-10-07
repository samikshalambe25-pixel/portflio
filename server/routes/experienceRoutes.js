const express = require('express');
const router = express.Router();
const Store = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  const experiences = Store.getExperiences();
  res.json({ success: true, count: experiences.length, data: experiences });
});

router.get('/:id', (req, res) => {
  const exp = Store.getExperienceById(req.params.id);
  if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' });
  res.json({ success: true, data: exp });
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const newExp = Store.createExperience(req.body);
    res.status(201).json({ success: true, data: newExp, message: 'Experience created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const updated = Store.updateExperience(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.json({ success: true, data: updated, message: 'Experience updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const deleted = Store.deleteExperience(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Experience not found' });
    res.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
