const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  points: {type: Number, required: true },
  mobileNumber: { type: String, default: '' },
  tier: { type: Number, default: 0 },
  membershipIDs: { type: [String], default: [] },
  vouchers: { type: [String], default: [] }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
