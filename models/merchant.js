const mongoose = require('mongoose')
const merchantSchema = new mongoose.Schema({
  refId: Number,
  updatedAt: Number,
}, {strict: false})

module.exports = mongoose.model('Merchant', merchantSchema, 'merchant')
