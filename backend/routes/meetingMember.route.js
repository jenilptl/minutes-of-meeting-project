const express = require('express');
const router = express.Router();
const meetingMemberService = require('../services/meetingMember.service');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/meeting/:meetingId', roleMiddleware(['Admin', 'Convener']), async (req, res) => {
    try {
        const members = await meetingMemberService.getMeetingMembers(req.params.meetingId);
        res.status(200).json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }  
});

router.post('/register', roleMiddleware(['Admin', 'Convener']), async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Request body is missing or empty." });
        }
        const result = await meetingMemberService.addMeetingMember(req.body);
        res.status(201).json({ success: true, message: 'Member added to meeting', data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.patch('/:id/attendance', roleMiddleware(['Admin', 'Convener']), async (req, res) => {
    try {
        const result = await meetingMemberService.updateAttendance(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Attendance updated', data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/:id', roleMiddleware(['Admin', 'Convener']), async (req, res) => {
    try {
        const result = await meetingMemberService.removeMeetingMember(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
});

module.exports = router;

