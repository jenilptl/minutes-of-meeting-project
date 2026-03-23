const db = require('../config/db');

class StaffModel {
    static async findAll() {
        const [rows] = await db.query(
            'SELECT StaffID, StaffName, Department, MobileNo, EmailAddress, Role, Remarks, Created, Modified FROM Staff'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT StaffID, StaffName, Department, MobileNo, EmailAddress, Role, Remarks, Created, Modified FROM Staff WHERE StaffID = ?',
            [id]
        );
        return rows[0];
    }

    static async create(staffData) {
        const { StaffName, Department, MobileNo, EmailAddress, PasswordHash, Role, Remarks } = staffData;
        const [result] = await db.query(
            'INSERT INTO Staff (StaffName, Department, MobileNo, EmailAddress, PasswordHash, Role, Remarks) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [StaffName, Department, MobileNo, EmailAddress, PasswordHash, Role, Remarks]
        );
        return result.insertId;
    }

    static async update(id, staffData) {
        const allowedFields = ['StaffName', 'Department', 'MobileNo', 'EmailAddress', 'Role', 'Remarks'];
        const filteredData = Object.keys(staffData)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = staffData[key];
                return obj;
            }, {});

        const fields = Object.keys(filteredData);
        const values = Object.values(filteredData);

        if (fields.length === 0) return false;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE Staff SET ${setClause} WHERE StaffID = ?`;

        const [result] = await db.query(query, [...values, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        await db.query('DELETE FROM meetingmember WHERE StaffID = ?', [id]);
        const [result] = await db.query('DELETE FROM Staff WHERE StaffID = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = StaffModel;
