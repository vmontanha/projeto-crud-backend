const express = require('express');
const { getUser, updateUser } = require('../controllers/userController');
const router = express.Router();

router.get('/:id', getUser);
router.put('/:id', updateUser);

module.exports = router;
