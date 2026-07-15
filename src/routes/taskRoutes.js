const express = require('express');
const router = express.Router();

const { createTask, getTasks, getTaskById, updateTask, deleteTask, completeTask } = require('../controllers/taskController');

const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.patch('/:id/complete', completeTask);
router.delete('/:id', deleteTask);

module.exports = router;