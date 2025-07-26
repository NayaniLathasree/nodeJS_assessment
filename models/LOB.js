const mongoose = require('mongoose');

const LOBSchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('LOB', LOBSchema);