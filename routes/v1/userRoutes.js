const express = require('express');
const UserController = require('../../controllers/userController');

const router = express.Router();

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
router.get('/', UserController.getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (v1)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created user
 */
router.post('/', UserController.createUserV1);

module.exports = router;
