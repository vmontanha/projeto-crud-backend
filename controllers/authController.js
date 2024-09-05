const { admin, db } = require('../models/firebase');

const register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const user = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        await db.collection('users').doc(user.uid).set({
            name,
            email,
        });

        return res.status(201).send({ uid: user.uid });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await admin.auth().getUserByEmail(email);
        // Lógica de autenticação usando Firebase Auth
        return res.status(200).send({ uid: user.uid });
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

module.exports = { register, login };
