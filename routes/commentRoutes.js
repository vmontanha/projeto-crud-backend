const express = require('express');
const {
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');
const router = express.Router();

// Rotas de Comentários
router.post('/', createComment);
router.get('/post/:postId', getCommentsByPostId);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;
