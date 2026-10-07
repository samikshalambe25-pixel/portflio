const express = require('express');
const router = express.Router();
const Store = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }
    const saved = Store.createContact({ name, email, subject, message });
    res.status(201).json({ success: true, data: saved, message: 'Your message has been received! Thank you.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', authMiddleware, (req, res) => {
  const contacts = Store.getContacts();
  res.json({ success: true, count: contacts.length, data: contacts });
});

router.get('/:id', authMiddleware, (req, res) => {
  const contact = Store.getContactById(req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: 'Message not found' });
  res.json({ success: true, data: contact });
});

router.patch('/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    const updated = Store.updateContactStatus(req.params.id, status || 'read');
    if (!updated) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, data: updated, message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const deleted = Store.deleteContact(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
