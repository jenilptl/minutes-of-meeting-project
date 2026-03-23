const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/login', async (req, res) => {
    try {
        const { mobileNo, password, role } = req.body;

        if (!mobileNo || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number, password, and role are required 123'
            });
        }

        const result = await authService.login(mobileNo, password, role);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            ...result
        });

    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || 'Login failed'
        });
    }
});

router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { staffId, oldPassword, newPassword } = req.body;

        if (!staffId || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Staff ID, old password, and new password are required'
            });
        }

        const result = await authService.changePassword(staffId, oldPassword, newPassword);

        res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Password change failed'
        });
    }
});

module.exports = router;
