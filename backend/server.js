const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const express = require('express');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();

connectDB();

// ─── Core Middleware ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(helmet());
app.use(morgan('dev'));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',          require('./src/routes/authRoutes'));
app.use('/api/v1/users',         require('./src/routes/userRoutes'));
app.use('/api/v1/roles',         require('./src/routes/roleRoutes'));
app.use('/api/v1/categories',    require('./src/routes/categoryRoutes'));
app.use('/api/v1/blogs',         require('./src/routes/blogRoutes'));
app.use('/api/v1/comments',      require('./src/routes/commentRoutes'));
app.use('/api/v1/contacts',      require('./src/routes/contactRoutes'));
app.use('/api/v1/notifications', require('./src/routes/notificationRoutes'));
app.use('/api/v1/services',      require('./src/routes/serviceRoutes'));
app.use('/api/v1/projects',      require('./src/routes/projectRoutes'));
app.use('/api/v1/team',          require('./src/routes/teamRoutes'));
app.use('/api/v1/testimonials',  require('./src/routes/testimonialRoutes'));
app.use('/api/v1/pricing',       require('./src/routes/pricingRoutes'));
app.use('/api/v1/subscribers',   require('./src/routes/subscriberRoutes'));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Zeeltech Agency API is live 🚀', version: 'v1' });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`));

module.exports = app;