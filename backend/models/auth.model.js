const db = require('../config/db');

class AuthModel {
    static async findByMobile(MobileNo) {
        const [rows] = await db.query(
            'SELECT StaffID, StaffName, MobileNo, PasswordHash, Role FROM Staff WHERE MobileNo = ?',
            [MobileNo]
        );
        return rows[0];
    }

    static async findAll() {
        const [rows] = await db.query(
            'SELECT StaffID, StaffName, Department, MobileNo, EmailAddress, PasswordHash, Role, Remarks, Created FROM Staff'
        );
        return rows;
    }

    static async findById(StaffID) {
        const [rows] = await db.query(
            'SELECT StaffID, PasswordHash FROM Staff WHERE StaffID = ?',
            [StaffID]
        );
        return rows[0];
    }

    static async updatePassword(StaffID, newPasswordHash) {
        const [result] = await db.query(
            'UPDATE Staff SET PasswordHash = ? WHERE StaffID = ?',
            [newPasswordHash, StaffID]
        );
        return result.affectedRows > 0;
    }

    static async createLoginLog(MobileNo) {
        await db.query(
            'INSERT INTO loginlog (MobileNo) VALUES (?)',
            [MobileNo]
        );
    }
}

module.exports = AuthModel;
