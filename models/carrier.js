const mongoose = require('mongoose');

const CarrierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Carrier', CarrierSchema);