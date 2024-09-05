const { db } = require('../models/firebase');

// Criação de uma nova postagem
const createPost = async (req, res) => {
    const { title, description, userId } = req.body;
    try {
        const post = await db.collection('posts').add({
            title,
            description,
            userId,
            views: 0,
            likes: 0,
            dislikes: 0,
            createdAt: new Date(),
            history: [],
        });
        return res.status(201).send({ id: post.id });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Obter todas as postagens
const getPosts = async (req, res) => {
    try {
        const postsSnapshot = await db.collection('posts').get();
        const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).send(posts);
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Obter uma postagem por ID
const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const postDoc = await db.collection('posts').doc(id).get();
        if (!postDoc.exists) {
            return res.status(404).send('Post not found');
        }
        return res.status(200).send(postDoc.data());
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Atualizar uma postagem
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const postRef = db.collection('posts').doc(id);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return res.status(404).send('Post not found');
        }

        // Adicionando a versão anterior ao histórico
        const history = postDoc.data().history || [];
        history.push({ title: postDoc.data().title, description: postDoc.data().description, updatedAt: new Date() });

        await postRef.update({ title, description, history });
        return res.status(200).send('Post updated');
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Deletar uma postagem
const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const postRef = db.collection('posts').doc(id);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return res.status(404).send('Post not found');
        }

        await postRef.delete();
        return res.status(200).send('Post deleted');
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Curtir uma postagem
const likePost = async (req, res) => {
    const { id } = req.params;
    try {
        const postRef = db.collection('posts').doc(id);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return res.status(404).send('Post not found');
        }

        const likes = postDoc.data().likes + 1;
        await postRef.update({ likes });
        return res.status(200).send('Post liked');
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Descurtir uma postagem
const dislikePost = async (req, res) => {
    const { id } = req.params;
    try {
        const postRef = db.collection('posts').doc(id);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return res.status(404).send('Post not found');
        }

        const dislikes = postDoc.data().dislikes + 1;
        await postRef.update({ dislikes });
        return res.status(200).send('Post disliked');
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

// Incrementar contagem de visualizações
const incrementViewCount = async (req, res, next) => {
    const { id } = req.params;
    try {
        const postRef = db.collection('posts').doc(id);
        const postDoc = await postRef.get();

        if (postDoc.exists) {
            const views = postDoc.data().views + 1;
            await postRef.update({ views });
        }
        
        next();
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    incrementViewCount,
};
