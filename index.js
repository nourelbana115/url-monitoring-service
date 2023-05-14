const express = require('express');
const { connectDB } = require('./config/db');
const { loadCheckJobs } = require('./services/internal/checkService')

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());


// Define Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/check', require('./routes/check'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

loadCheckJobs();
