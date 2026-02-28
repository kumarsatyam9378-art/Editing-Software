const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    plan: {
      type: String,
      enum: ['free', 'pro', 'studio'],
      default: 'free'
    },
    stripeCustomerId: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
