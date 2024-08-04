const mongoose = require('mongoose');

const deleteRequestSchema = new mongoose.Schema({
  transactionIds: {
    type: [String],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  request_date: {
    type: Date,
    required: true,
  },
});

const DeleteRequest = mongoose.model('DeleteRequest', deleteRequestSchema);

module.exports = DeleteRequest;
