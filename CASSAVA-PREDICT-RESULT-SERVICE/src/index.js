require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authenticateToken = require('./middleware/authenticateToken');
const deleteOldRecords = require('./tasks/deleteOldRecords'); // นำเข้า deleteOldRecords
const schedule = require('node-schedule');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    optionsSuccessStatus: 200
}));

// Rate limiting
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
}));

// Route imports
const authRoutes = require('./routes/authRoutes');
const resultRoutes = require('./routes/predictRoutes');
const interfaceRoutes = require('./routes/interfaceRoutes');

// Use routes with middleware
app.use('/api/auth', authRoutes);
app.use('/results', authenticateToken, resultRoutes);
app.use('/interfaces', authenticateToken, interfaceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

// Start the server
const PORT = process.env.PREDICT_RESULT_PORT || 8003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// กำหนดงานด้วย node-schedule ให้ลบข้อมูลเก่าทุกเที่ยงคืน
schedule.scheduleJob('0 0 * * *', async () => {
    try {
        await deleteOldRecords();
        console.log('Scheduled task: Old records deletion completed.');
    } catch (error) {
        console.error('Error executing scheduled deletion task:', error.message);
    }
});
