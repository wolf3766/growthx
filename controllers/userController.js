const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Assignment = require('../models/assignment');
const { validateRegister, validateLogin } = require('../utils/validation');

// User Registration
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        const { error } = validateRegister(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

// Upload Assignment
exports.uploadAssignment = async (req, res) => {
    try {
        const { task, adminId } = req.body;
        const assignment = new Assignment({
            userId: req.user.id,
            task,
            adminId
        });
        await assignment.save();
        res.status(201).json({ message: 'Assignment uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading assignment' });
    }
};
