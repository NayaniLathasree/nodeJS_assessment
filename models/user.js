const { boolean, required } = require('joi');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  userType: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);