// backend/models/AuditLog.js
const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    default: () => new Date().toLocaleString('en-US')
  },
  category: {
    type: String,
    enum: ['Auth', 'Action', 'User', 'Document', 'Delivery'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
