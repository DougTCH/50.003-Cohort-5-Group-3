const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Load environment variables from .env file
require('dotenv').config();

// Middleware
app.use(bodyParser.json());  // parses incoming json request, makes data accessible via req.body
app.use(cors());  // enables cross-origin resource sharing

// MongoDB connection
const mongoURI = process.env.MONGODB_URI; // this is the mongoDB connection string

mongoose.connect(mongoURI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Routes
const authRoutes = require('./routes/auth');
const transactRoutes = require('./routes/transact');

app.use('/api', authRoutes);
app.use('/api', transactRoutes);


module.exports = app;
