const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/auth.model');

class AuthService {
    async login(mobileNo, password, role) {
        try {
            const staff = await AuthModel.findByMobile(mobileNo);

            if (!staff || staff.Role !== role) {
                throw new Error('Invalid mobile number, password, or role 1');
            }

            const isPasswordValid = await bcrypt.compare(password, staff.PasswordHash);

            if (!isPasswordValid) {
                throw new Error('Invalid mobile number, password, or role 1');
            }

            await AuthModel.createLoginLog(mobileNo);

            const token = jwt.sign(
                {
                    id: staff.StaffID,
                    mobile: staff.MobileNo,
                    role: staff.Role
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            return {
                token: token,
                user: {
                    id: staff.StaffID,
                    name: staff.StaffName,
                    role: staff.Role,
                    mobile: staff.MobileNo
                }
            };

        } catch (error) {
            throw error;
        }
    }

    async changePassword(staffId, oldPassword, newPassword) {
        try {
            const staff = await AuthModel.findById(staffId);
            if (!staff) {
                throw new Error('Staff member not found');
            }

            const isOldPasswordCorrect = await bcrypt.compare(oldPassword, staff.PasswordHash);
            if (!isOldPasswordCorrect) {
                throw new Error('Old password is incorrect');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);

            await AuthModel.updatePassword(staffId, hashedNewPassword);

            return { message: 'Password changed successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthService();
