const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const express = require('express');
const errorHandler = require('./src/middleware/errorHandler')
dotenv.config();

const app = express();

connectDB();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({message: "Zeeltech agency API is live"})
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running live on port ${PORT}`));