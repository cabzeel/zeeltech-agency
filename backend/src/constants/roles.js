const ROLES = {
  SUPERADMIN: 'superadmin',
  EDITOR: 'editor',
  CONTRIBUTOR: 'contributor',
};

const RESOURCES = {
  POSTS: 'posts',
  USERS: 'users',
  COMMENTS: 'comments',
  PROJECTS: 'projects',
  SERVICES: 'services',
  TESTIMONIALS: 'testimonials',
};

const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
};

module.exports = { ROLES, RESOURCES, ACTIONS };
