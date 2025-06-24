const express = require("express");
const cors = require("cors");
const ConnectDB = require('./config/db');
require("dotenv").config();

const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');
const postRoutes = require('./routes/post-routes'); 
const messageRoutes = require('./routes/message-routes'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
ConnectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/message',messageRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
