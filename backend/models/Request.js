const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  quantity: {
    type: Number,
    required: true
  },
  fulfilled: {
    type: String,
    default: function() { return `0/${this.quantity}`; }
  },
  description: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
  ngo: {
    type: String, // Matches NGO Name
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Stopped'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Request', RequestSchema);
