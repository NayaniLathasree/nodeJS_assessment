const mongoose = require('mongoose');

const ScheduledMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  day: { type: String, required: true },      
  time: { type: String, required: true },
  isActive: { type: Boolean, default: true }   
});

module.exports = mongoose.model('ScheduledMessage', ScheduledMessageSchema);