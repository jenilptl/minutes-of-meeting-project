import "./MarkAttendance.css";

const MarkAttendance = ({ members = [] }) => {

  return (
    <div className="attendance-card">
      <h4>Mark Attendance</h4>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {members.map(m => (
            <tr key={m.MeetingMemberID}>
              <td>{m.StaffName}</td>
              <td>
                <span className={`status-pill ${m.IsPresent ? 'present' : 'absent'}`}>
                  {m.IsPresent ? 'Present' : 'Absent'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarkAttendance;
