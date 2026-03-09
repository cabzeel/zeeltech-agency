const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    // Mongoose cast error 
    if(err.name = 'CastError') {
        statusCode = 404;
        message = "resource not found"
    }

    // Mongoose validation error 
    if(err.name = 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ')
    }

    //Mongoose duplicate keys
    if(err.code = 11000) {
        statusCode = 400;
        message = `${Object.keys(err.keyValue)} already exists`;
    }

    //JWT expired token
    if(err.name = 'TokenExpiredError') {
        statusCode = 401;
        message = "Token expired, please sign in again"
    }

    res.status(statusCode).json({
        success: false,
        message
    })
}

module.exports = errorHandler;