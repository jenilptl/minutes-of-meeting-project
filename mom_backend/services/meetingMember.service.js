const MeetingMemberModel = require('../models/meetingMember.model');

class MeetingMemberService {
    async getMeetingMembers(meetingId) {
        try {
            return await MeetingMemberModel.findByMeetingId(meetingId);
        } catch (error) {
            throw error;
        }
    }

    async addMeetingMember(data) {
        try {
            const memberId = await MeetingMemberModel.create(data);
            return await MeetingMemberModel.findById(memberId);
        } catch (error) {
            throw error;
        }
    }

    async updateAttendance(id, data) {
        try {
            const success = await MeetingMemberModel.updateAttendance(id, data);
            if (!success) throw new Error('Member not found or no changes made');
            return await MeetingMemberModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async removeMeetingMember(id) {
        try {
            const success = await MeetingMemberModel.delete(id);
            if (!success) throw new Error('Member not found');
            return { message: 'Member removed from meeting successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MeetingMemberService();
