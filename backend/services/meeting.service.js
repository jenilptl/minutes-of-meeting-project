const MeetingModel = require('../models/meeting.model');

class MeetingService {
    async getMeetings(user) {
        try {
            if (user.role === 'Admin') {
                return await MeetingModel.findAll();
            }
            return await MeetingModel.findByStaffParticipation(user.id);
        } catch (error) {
            throw error;
        }
    }

    async getMeetingById(id, user) {
        try {
            const meeting = await MeetingModel.findById(id);
            if (!meeting) throw new Error('Meeting not found');

            if (user.role !== 'Admin') {
                const isParticipant = await MeetingModel.isMember(id, user.id);
                if (!isParticipant) throw new Error('Access denied: You are not a member of this meeting');
            }

            return meeting;
        } catch (error) {
            throw error;
        }
    }

    async createMeeting(user, data) {
        try {
            if (user.role !== 'Admin' && user.role !== 'Convener') {
                throw new Error('Access denied: Only Admin or Convener can create meetings');
            }
            const meetingId = await MeetingModel.create(data);
            return await MeetingModel.findById(meetingId);
        } catch (error) {
            throw error;
        }
    }

    async updateMeeting(id, data, user) {
        try {
            if (user.role === 'Staff') {
                throw new Error('Access denied: Staff cannot update meetings');
            }

            if (user.role === 'Convener') {
                const isParticipant = await MeetingModel.isMember(id, user.id);
                if (!isParticipant) throw new Error('Access denied: You can only update meetings you participate in');
            }

            const success = await MeetingModel.update(id, data);
            if (!success) throw new Error('Meeting not found or no changes made');
            return await MeetingModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async cancelMeeting(id, reason, user) {
        try {
            if (user.role === 'Staff') {
                throw new Error('Access denied: Staff cannot cancel meetings');
            }

            if (user.role === 'Convener') {
                const isParticipant = await MeetingModel.isMember(id, user.id);
                if (!isParticipant) throw new Error('Access denied: You can only cancel meetings you participate in');
            }

            const success = await MeetingModel.cancel(id, reason);
            if (!success) throw new Error('Meeting not found');
            return await MeetingModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async deleteMeeting(id, user) {
        try {
            if (user.role !== 'Admin' && user.role !== 'Convener') {
                throw new Error('Access denied: Only Admin or Convener can delete meetings');
            }

            if (user.role === 'Convener') {
                const isParticipant = await MeetingModel.isMember(id, user.id);
                if (!isParticipant) throw new Error('Access denied: You can only delete meetings you participate in');
            }

            const success = await MeetingModel.delete(id);
            if (!success) throw new Error('Meeting not found');
            return { message: 'Meeting deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MeetingService();


