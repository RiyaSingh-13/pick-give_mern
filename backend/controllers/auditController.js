// backend/controllers/auditController.js
const AuditLog = require('../models/AuditLog');
const fallbackDb = require('../config/fallbackDb');

// @desc    Post a manual Audit Log
// @route   POST /api/audits
// @access  Public (Internal/Admin)
exports.createLog = async (req, res) => {
  try {
    const { event, category } = req.body;
    if (!event || !category) {
      return res.status(400).json({ error: 'Event message and category are required.' });
    }

    if (!global.isDbConnected) {
      const newLog = fallbackDb.saveLog(event, category);
      return res.status(201).json(newLog);
    }

    const newLog = new AuditLog({ event, category });
    await newLog.save();

    res.status(201).json(newLog);
  } catch (error) {
    console.error('createLog Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// @desc    Get all System Audit Logs
// @route   GET /api/audits
// @access  Public (Admin)
exports.getLogs = async (req, res) => {
  try {
    if (!global.isDbConnected) {
      const logs = fallbackDb.getLogs();
      return res.status(200).json(logs);
    }

    const logs = await AuditLog.find().sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error('getLogs Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
