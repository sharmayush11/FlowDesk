const Task = require('../models/Task');

// GET /api/tasks?boardId=xxx
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.query.boardId })
      .populate('assignee', 'name avatar')
      .populate('createdBy', 'name')
      .sort('order');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  try {
    const {
  title,
  description,
  board,
  columnId,
  assignee,
  labels,
  dueDate,
  priority,
} = req.body;
    const count = await Task.countDocuments({ board, columnId });
    const task = await Task.create({
      title, description, board, columnId, assignee, labels, dueDate,priority,
      createdBy: req.user.id,
      order: count,
    });
    await task.populate('assignee', 'name avatar');
    await task.populate('createdBy', 'name');
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/tasks/:id
exports.updateTask = async (req, res) => {
  try {
    const allowedFields = [
      'title',
      'description',
      'dueDate',
      'priority',
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.priority !== undefined &&
      !['low', 'medium', 'high'].includes(updates.priority)
    ) {
      return res.status(400).json({
        message: 'Priority must be low, medium, or high',
      });
    }

    if (
      updates.title !== undefined &&
      !updates.title.trim()
    ) {
      return res.status(400).json({
        message: 'Task title is required',
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate('assignee', 'name avatar')
      .populate('createdBy', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// PATCH /api/tasks/:id/move — drag & drop
exports.moveTask = async (req, res) => {
  try {
    const { columnId, order } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { columnId, order },
      { new: true }
    ).populate('assignee', 'name avatar');
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks/:id/comment
exports.addComment = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user: req.user.id, text: req.body.text } } },
      { new: true }
    ).populate('comments.user', 'name avatar');
    res.json(task.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
