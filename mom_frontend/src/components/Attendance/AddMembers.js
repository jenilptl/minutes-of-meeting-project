import { useState } from "react";
import Toast from "../Toast/Toast";
import "./AddMembers.css";

const AddMembers = ({ meetings = [], staffList = [], onAddMember }) => {
  const [meetingId, setMeetingId] = useState("");
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const toggleStaff = (id) => {
    setSelectedStaff(
      selectedStaff.includes(id)
        ? selectedStaff.filter((s) => s !== id)
        : [...selectedStaff, id]
    );
  };

  const handleSubmit = () => {
    if (!meetingId || selectedStaff.length === 0) return;

    selectedStaff.forEach(id => {
        onAddMember(meetingId, id);
    });

    setMeetingId("");
    setSelectedStaff([]);
    setToast({ message: "Members added (Processing...)", type: "success" });
  };

  return (
    <div className="attendance-card">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      <h4>Add Meeting Members</h4>

      <select
        value={meetingId}
        onChange={(e) => setMeetingId(e.target.value)}
      >
        <option value="">Select Meeting</option>
        {meetings.map((m) => (
          <option key={m.MeetingID} value={m.MeetingID}>
            {m.MeetingDescription}
          </option>
        ))}
      </select>

      <ul className="staff-list">
        {staffList.map((s) => (
          <li key={s.StaffID}>
            <label>
              <input
                type="checkbox"
                checked={selectedStaff.includes(s.StaffID)}
                onChange={() => toggleStaff(s.StaffID)}
              />
              <span>{s.StaffName}</span>
            </label>
          </li>
        ))}
      </ul>

      <button onClick={handleSubmit} className="btn-add-members">Add Members</button>
    </div>
  );
};

export default AddMembers;
