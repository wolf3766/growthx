const express = require('express');
const { register, login, uploadAssignment } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/upload', authMiddleware, uploadAssignment);

module.exports = router;
