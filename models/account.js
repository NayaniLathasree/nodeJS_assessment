
const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('UserAccount', AccountSchema);