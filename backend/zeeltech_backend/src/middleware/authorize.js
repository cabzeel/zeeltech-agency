const authorize = (resource, action) => {
    return (req, res, next) => {
        const hasPermission = req.user.role.permissions.some(
            p => p.resource === resource && p.actions.includes(action)
        );

        if (!hasPermission) {
            const error = new Error('You do not have permission to perform this action');
            error.statusCode = 403;
            return next(error);
        }

        next();
    };
};

module.exports = authorize;