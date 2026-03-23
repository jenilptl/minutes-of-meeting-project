const bcrypt = require('bcrypt');
const StaffModel = require('../models/staff.model');

class StaffService {
    async getAllStaff() {
        try {
            return await StaffModel.findAll();
        } catch (error) {
            throw error;
        }
    }

    async getStaffById(id) {
        try {
            const staff = await StaffModel.findById(id);
            if (!staff) throw new Error('Staff member not found');
            return staff;
        } catch (error) {
            throw error;
        }
    }

    async registerStaff(staffData) {
        try {
            const { password, ...otherData } = staffData;

            if (!password) throw new Error('Password is required for registration');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newStaff = {
                ...otherData,
                PasswordHash: hashedPassword
            };

            const staffId = await StaffModel.create(newStaff);
            return { id: staffId, ...otherData };
        } catch (error) {
            throw error;
        }
    }

    async updateStaff(id, updateData) {
        try {
            const { password, PasswordHash, ...dataToUpdate } = updateData;

            const success = await StaffModel.update(id, dataToUpdate);
            if (!success) throw new Error('Staff member not found or no changes made');

            return await StaffModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async deleteStaff(id) {
        try {
            const success = await StaffModel.delete(id);
            if (!success) throw new Error('Staff member not found');
            return { message: 'Staff member deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new StaffService();
