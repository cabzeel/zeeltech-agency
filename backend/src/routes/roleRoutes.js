const express = require('express');
const router = express.Router();
const { createRole, getRoles, getRole, updateRole, deleteRole } = require('../controllers/roleController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

router.use(verifyToken);

router.route('/')
  .get(authorize('users', 'read'), getRoles)
  .post(authorize('users', 'create'), createRole);

router.route('/:id')
  .get(authorize('users', 'read'), getRole)
  .put(authorize('users', 'update'), updateRole)
  .delete(authorize('users', 'delete'), deleteRole);

module.exports = router;
