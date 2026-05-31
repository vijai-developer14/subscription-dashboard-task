const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: [{ type: String }],
  duration: { type: Number, required: true }, // in days
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
