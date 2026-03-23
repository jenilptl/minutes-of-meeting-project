import "./AttendanceSummary.css";

const AttendanceSummary = ({ members = [] }) => {
  const role = localStorage.getItem("role");
  const staffId = Number(localStorage.getItem("staffId"));

  const relevantAttendance =
    role === "Admin"
      ? members
      : members.filter((m) => m.StaffID === staffId);

  const presentCount = relevantAttendance.filter(
    (m) => m.IsPresent
  ).length;

  const absentCount = relevantAttendance.filter(
    (m) => !m.IsPresent
  ).length;

  return (
    <div className="attendance-card">
      <h4>
        {role === "Admin"
          ? "Overall Attendance Summary"
          : "My Attendance Summary"}
      </h4>

      <p>Present: {presentCount}</p>
      <p>Absent: {absentCount}</p>
    </div>
  );
};

export default AttendanceSummary;
