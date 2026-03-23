const db = require('../config/db');

class MeetingModel {
    static async findAll() {
        const [rows] = await db.query(
            `SELECT m.*, mt.MeetingTypeName 
             FROM meetings m
             LEFT JOIN meetingtype mt ON m.MeetingTypeID = mt.MeetingTypeID
             ORDER BY m.MeetingDate DESC`
        );
        return rows;
    }

    static async findByStaffParticipation(staffId) {
        const [rows] = await db.query(
            `SELECT m.*, mt.MeetingTypeName, mm.IsPresent 
             FROM meetings m
             LEFT JOIN meetingtype mt ON m.MeetingTypeID = mt.MeetingTypeID
             INNER JOIN meetingmember mm ON m.MeetingID = mm.MeetingID
             WHERE mm.StaffID = ?
             ORDER BY m.MeetingDate DESC`,
            [staffId]
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `SELECT m.*, mt.MeetingTypeName 
             FROM meetings m
             LEFT JOIN meetingtype mt ON m.MeetingTypeID = mt.MeetingTypeID
             WHERE m.MeetingID = ?`,
            [id]
        );
        return rows[0];
    }

    static async create(data) {
        const { MeetingDate, MeetingTypeID, MeetingDescription, Venue, DocumentPath } = data;
        const [result] = await db.query(
            `INSERT INTO meetings (MeetingDate, MeetingTypeID, MeetingDescription, Venue, DocumentPath) 
             VALUES (?, ?, ?, ?, ?)`,
            [MeetingDate, MeetingTypeID, MeetingDescription, Venue, DocumentPath]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const allowedFields = ['MeetingDate', 'MeetingTypeID', 'MeetingDescription', 'Venue', 'DocumentPath', 'IsCancelled', 'CancellationDateTime', 'CancellationReason', 'Decision', 'Presenter', 'Department'];
        const filteredData = Object.keys(data)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});

        const fields = Object.keys(filteredData);
        const values = Object.values(filteredData);
        if (fields.length === 0) return false;

        const setClause = fields.map(field => `${field} = ?`).join(', ');
        const query = `UPDATE meetings SET ${setClause} WHERE MeetingID = ?`;
        const [result] = await db.query(query, [...values, id]);
        return result.affectedRows > 0;
    }

    static async cancel(id, reason) {
        const [result] = await db.query(
            `UPDATE meetings 
             SET IsCancelled = 1, CancellationDateTime = NOW(), CancellationReason = ? 
             WHERE MeetingID = ?`,
            [reason, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        await db.query('DELETE FROM meetingmember WHERE MeetingID = ?', [id]);
        const [result] = await db.query('DELETE FROM meetings WHERE MeetingID = ?', [id]);
        return result.affectedRows > 0;
    }

    static async isMember(meetingId, staffId) {
        const [rows] = await db.query(
            'SELECT 1 FROM meetingmember WHERE MeetingID = ? AND StaffID = ?',
            [meetingId, staffId]
        );
        return rows.length > 0;
    }
}

module.exports = MeetingModel;
