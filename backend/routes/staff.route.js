const express = require('express');
const router = express.Router();
const staffService = require('../services/staff.service');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/', authMiddleware, roleMiddleware(['Admin', 'Convener']), async (req, res) => {
    try {
        const staff = await staffService.getAllStaff();
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role === 'Staff' && String(req.user.id) !== String(req.params.id)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const staff = await staffService.getStaffById(req.params.id);
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        // Force Role to "Staff" for all public signups — only Admin can change role later
        const safeBody = { ...req.body, Role: 'Staff' };
        const result = await staffService.registerStaff(safeBody);
        res.status(201).json({ success: true, message: 'Staff registered successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role === 'Staff' && String(req.user.id) !== String(req.params.id)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        const result = await staffService.updateStaff(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Staff updated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), async (req, res) => {
    try {
        const result = await staffService.deleteStaff(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

module.exports = router;
