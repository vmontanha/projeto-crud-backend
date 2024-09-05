const { db } = require('../models/firebase');

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const userDoc = await db.collection('users').doc(id).get();
        if (!userDoc.exists) {
            return res.status(404).send('User not found');
        }
        return res.status(200).send(userDoc.data());
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        await db.collection('users').doc(id).update({ name, email });
        return res.status(200).send('User updated');
    } catch (error) {
        return res.status(400).send(error.message);
    }
};

module.exports = { getUser, updateUser };
