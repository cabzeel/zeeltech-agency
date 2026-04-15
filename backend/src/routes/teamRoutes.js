const express = require('express');
const router = express.Router();
const { createTeamMember, getTeamMembers, getTeamMember, getTeamMemberBySlug, updateTeamMember, deleteTeamMember, reorderTeam } = require('../controllers/teamController');
const { verifyToken } = require('../middleware/protect');
const authorize = require('../middleware/authorize');

// Public
router.get('/', getTeamMembers);
router.get('/slug/:slug', getTeamMemberBySlug);
router.get('/:id', getTeamMember);

// Protected
router.post('/', verifyToken, authorize('users', 'create'), createTeamMember);
router.put('/reorder', verifyToken, authorize('users', 'update'), reorderTeam);
router.put('/:id', verifyToken, authorize('users', 'update'), updateTeamMember);
router.delete('/:id', verifyToken, authorize('users', 'delete'), deleteTeamMember);

module.exports = router;
