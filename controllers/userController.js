const UserModel = require('../models/userModel');

const UserController = {
  getAllUsers: (req, res) => {
    const users = UserModel.getAllUsers();
    res.status(200).json(users);
  },

  getUserById: (req, res) => {
    const user = UserModel.getUserById(parseInt(req.params.id, 10));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  },

  createUserV1: (req, res) => {
    // v1 does not require 'age' field
    const newUser = UserModel.createUser(req.body);
    res.status(201).json(newUser);
  },

  createUserV2: (req, res) => {
    // v2 has 'age' field
    const newUser = UserModel.createUser({
      ...req.body,
      age: req.body.age || null,
    });
    res.status(201).json(newUser);
  },
};

module.exports = UserController;
