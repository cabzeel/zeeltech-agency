const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUser, updateUser, updatePassword, deleteUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

router.use(verifyToken);

router.route('/')
  .get(authorize('users', 'read'), getUsers)
  .post(authorize('users', 'create'), createUser);

router.put('/update-password', updatePassword);

router.route('/:id')
  .get(authorize('users', 'read'), getUser)
  .put(authorize('users', 'update'), updateUser)
  .delete(authorize('users', 'delete'), deleteUser);

module.exports = router;
