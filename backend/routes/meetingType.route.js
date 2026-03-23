const express = require('express');
const router = express.Router();
const meetingTypeService = require('../services/meetingType.service');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/', roleMiddleware(['Admin', 'Convener']), async (req, res) => {
    try {
        const result = await meetingTypeService.getAllMeetingTypes();
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', roleMiddleware(['Admin', 'Convener', 'staff']), async (req, res) => {
    try {
        const result = await meetingTypeService.getMeetingTypeById(req.params.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

router.post('/', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const result = await meetingTypeService.createMeetingType(req.body);
        res.status(201).json({ success: true, message: 'Meeting type created successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.patch('/:id', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const result = await meetingTypeService.updateMeetingType(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Meeting type updated successfully', data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/:id', roleMiddleware(['Admin']), async (req, res) => {
    try {
        const result = await meetingTypeService.deleteMeetingType(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

module.exports = router;

