const MeetingTypeModel = require('../models/meetingType.model');

class MeetingTypeService {
    async getAllMeetingTypes() {
        try {
            return await MeetingTypeModel.findAll();
        } catch (error) {
            throw error;
        }
    }

    async getMeetingTypeById(id) {
        try {
            const result = await MeetingTypeModel.findById(id);
            if (!result) throw new Error('Meeting type not found');
            return result;
        } catch (error) {
            throw error;
        }
    }

    async createMeetingType(data) {
        try {
            if (!data.MeetingTypeName) throw new Error('Meeting Type Name is required');
            const id = await MeetingTypeModel.create(data);
            return { MeetingTypeID: id, ...data };
        } catch (error) {
            throw error;
        }
    }

    async updateMeetingType(id, data) {
        try {
            const success = await MeetingTypeModel.update(id, data);
            if (!success) throw new Error('Meeting type not found or no changes made');
            return await MeetingTypeModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async deleteMeetingType(id) {
        try {
            const success = await MeetingTypeModel.delete(id);
            if (!success) throw new Error('Meeting type not found');
            return { message: 'Meeting type deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new MeetingTypeService();
