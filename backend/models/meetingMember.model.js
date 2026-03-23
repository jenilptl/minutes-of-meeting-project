const db = require('../config/db');

class MeetingMemberModel {
    static async findByMeetingId(meetingId) {
        const [rows] = await db.query(
            `SELECT mm.MeetingMemberID, mm.MeetingID, mm.StaffID, s.StaffName, s.Role, mm.IsPresent, mm.Remarks, mm.Created 
             FROM meetingmember mm
             JOIN Staff s ON mm.StaffID = s.StaffID
             WHERE mm.MeetingID = ?`,
            [meetingId]
        );
        return rows;
    }

    static async create(data) {
        const { MeetingID, StaffID, IsPresent = 0, Remarks = "" } = data;
        const [result] = await db.query(
            'INSERT INTO meetingmember (MeetingID, StaffID, IsPresent, Remarks) VALUES (?, ?, ?, ?)',
            [MeetingID, StaffID, IsPresent, Remarks || ""]
        );
        return result.insertId;
    }

    static async updateAttendance(id, data) {
        const { IsPresent, Remarks } = data;
        const [result] = await db.query(
            'UPDATE meetingmember SET IsPresent = ?, Remarks = ? WHERE MeetingMemberID = ?',
            [IsPresent, Remarks || "", id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM meetingmember WHERE MeetingMemberID = ?', [id]);
        return result.affectedRows > 0;
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT * FROM meetingmember WHERE MeetingMemberID = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = MeetingMemberModel;
