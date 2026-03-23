const db = require('../config/db');

class MeetingTypeModel {
    static async findAll() {
        const [rows] = await db.query(
            'SELECT MeetingTypeID, MeetingTypeName, Remarks, Created, Modified FROM meetingtype'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT MeetingTypeID, MeetingTypeName, Remarks, Created, Modified FROM meetingtype WHERE MeetingTypeID = ?',
            [id]
        );
        return rows[0];
    }

    static async create(data) {
        const { MeetingTypeName, Remarks } = data;
        const [result] = await db.query(
            'INSERT INTO meetingtype (MeetingTypeName, Remarks) VALUES (?, ?)',
            [MeetingTypeName, Remarks]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const fields = Object.keys(data);
        const values = Object.values(data);

        if (fields.length === 0) return false;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE meetingtype SET ${setClause} WHERE MeetingTypeID = ?`;

        const [result] = await db.query(query, [...values, id]);
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM meetingtype WHERE MeetingTypeID = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = MeetingTypeModel;
