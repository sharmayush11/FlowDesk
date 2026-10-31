const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  board:       { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  columnId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  assignee:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  labels:      [{ text: String, color: String }],
  dueDate:     { type: Date },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },


  order:       { type: Number, default: 0 },
  attachments: [{ url: String, name: String }],
  comments:    [{
    user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text:      String,
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
