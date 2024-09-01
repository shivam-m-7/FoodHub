const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../../models/userModel');
const auth = require('../middleware/auth');

dotenv.config();

// @route   POST /signup
// @desc    Register a user
// @access  Public


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Signup (v1)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = await User.create({ name, email, password });

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /login
// @desc    Authenticate user & get token
// @access  Public

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Login (v1)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /me
// @desc    Get logged in user info
// @access  Private

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (v1)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
