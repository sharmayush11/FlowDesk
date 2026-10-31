const router = require('express').Router();
const protect = require('../middleware/auth.middleware');
const {
  getTasks, createTask, updateTask,
  moveTask, deleteTask, addComment
} = require('../controllers/task.controller');

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').patch(updateTask).delete(deleteTask);
router.patch('/:id/move', moveTask);
router.post('/:id/comment', addComment);

module.exports = router;
