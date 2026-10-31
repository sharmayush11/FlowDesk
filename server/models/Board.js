const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
});

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
});

const boardSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  background:  { type: String, default: '#0079BF' },
  members:     [memberSchema],
  columns:     [columnSchema],
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);
