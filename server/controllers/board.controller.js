const Board = require('../models/Board');
const User = require('../models/User');

// GET /api/boards — my boards
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ 'members.user': req.user.id })
      .populate('members.user', 'name avatar email')
      .sort('-createdAt');
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/boards — create board
exports.createBoard = async (req, res) => {
  try {
    const { title, description, background } = req.body;
    const board = await Board.create({
      title, description, background,
      members: [{ user: req.user.id, role: 'owner' }],
      columns: [
        { title: 'To Do', order: 0 },
        { title: 'In Progress', order: 1 },
        { title: 'Done', order: 2 },
      ],
    });
    await board.populate('members.user', 'name avatar email');
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/boards/:id
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('members.user', 'name avatar email');
    if (!board) return res.status(404).json({ message: 'Board not found' });
    const isMember = board.members.some(m => m.user._id.toString() === req.user.id);
    if (!isMember) return res.status(403).json({ message: 'Access denied' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/boards/:id — update
exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('members.user', 'name avatar email');
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/boards/:id
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Only the board owner can delete it
    const membership = board.members.find(
      (member) => member.user.toString() === req.user.id
    );

    if (!membership || membership.role !== 'owner') {
      return res.status(403).json({
        message: 'Only the board owner can delete this board',
      });
    }

    await Board.findByIdAndDelete(board._id);

    res.json({ message: 'Board deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// POST /api/boards/:id/invite
exports.inviteMember = async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const board = await Board.findById(req.params.id);
    const alreadyMember = board.members.some(m => m.user.toString() === user._id.toString());
    if (alreadyMember) return res.status(400).json({ message: 'Already a member' });

    board.members.push({ user: user._id, role });
    await board.save();
    await board.populate('members.user', 'name avatar email');
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
