const router = require('express').Router();
const protect = require('../middleware/auth.middleware');
const {
  getBoards, createBoard, getBoardById,
  updateBoard, deleteBoard, inviteMember
} = require('../controllers/board.controller');

router.use(protect);

router.route('/').get(getBoards).post(createBoard);
router.route('/:id').get(getBoardById).patch(updateBoard).delete(deleteBoard);
router.post('/:id/invite', inviteMember);

module.exports = router;
