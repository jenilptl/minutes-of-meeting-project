const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const meetingTypeRoutes = require('./routes/meetingType.route');
const meetingRoutes = require('./routes/meeting.route');
const staffRoutes = require('./routes/staff.route');
const meetingMemberRoutes = require('./routes/meetingMember.route');
const authMiddleware = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the MOM Backend API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);

app.use(authMiddleware);

app.use('/api/meeting-types', meetingTypeRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/meeting-members', meetingMemberRoutes);

app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    try {
        await db.query('SELECT 1');
        console.log('✅ MySQL Database connected successfully');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
});
