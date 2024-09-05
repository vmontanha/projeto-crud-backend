const { db } = require('../models/firebase');

// Criar um novo comentário
const createComment = async (req, res) => {
    const { postId, userId, description } = req.body;
    try {
        const comment = await db.collection('comments').add({
            postId,
            userId,
            description,
            createdAt: new Date(),
        });

        // Enviar email ao autor do post sobre o novo comentário (lógica de email a ser adicionada)
        
        return res.status(201).send({ id: comment.id });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Obter comentários por ID do post
const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    try {
        const commentsSnapshot = await db.collection('comments').where('postId', '==', postId).get();
        const comments = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).send(comments);
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Atualizar um comentário
const updateComment = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        const commentRef = db.collection('comments').doc(id);
        const commentDoc = await commentRef.get();

        if (!commentDoc.exists) {
            return res.status(404).send('Comment not found');
        }

        await commentRef.update({ description });
        return res.status(200).send('Comment updated');
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Deletar um comentário
const deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const commentRef = db.collection('comments').doc(id);
        const commentDoc = await commentRef.get();

        if (!commentDoc.exists) {
            return res.status(404).send('Comment not found');
        }

        // Marcador de comentário removido (ao invés de deletar realmente)
        await commentRef.update({ description: '[This comment has been removed]' });
        return res.status(200).send('Comment removed');
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

module.exports = {
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
};
