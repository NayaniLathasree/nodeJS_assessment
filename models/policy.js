const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  policyNumber: { type: String, required: true },
  policyStartDate: Date,
  policyEndDate: Date,
  policyType: String,
  producer: String,
  premiumAmount: Number,
  premiumAmountWritten: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB' },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  userAccountId : { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }
});


module.exports = mongoose.model('Policy', PolicySchema);