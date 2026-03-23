const express = require('express');
const router = express.Router();
const meetingService = require('../services/meeting.service');

router.get('/', async (req, res) => {
    try {
        const result = await meetingService.getMeetings(req.user);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/my-history', async (req, res) => {
    try {
        const MeetingModel = require('../models/meeting.model');
        const result = await MeetingModel.findByStaffParticipation(req.user.id);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await meetingService.getMeetingById(req.params.id, req.user);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await meetingService.createMeeting(req.user, req.body);
        res.status(201).json({ success: true, message: 'Meeting created successfully', data: result });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const result = await meetingService.updateMeeting(req.params.id, req.body, req.user);
        res.status(200).json({ success: true, message: 'Meeting updated successfully', data: result });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
});

router.patch('/:id/cancel', async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason) throw new Error('Cancellation reason is required');

        const result = await meetingService.cancelMeeting(req.params.id, reason, req.user);
        res.status(200).json({ success: true, message: 'Meeting cancelled successfully', data: result });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await meetingService.deleteMeeting(req.params.id, req.user);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
});

module.exports = router;

