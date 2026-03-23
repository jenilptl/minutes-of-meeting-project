import "./MeetingList.css";
import EditMeeting from "../EditMeeting/EditMeeting";

const MeetingList = ({ meetings, onEdit, selectedMeetingId, onCancel, onUpdate, showToast }) => {
  const role = localStorage.getItem("role");
  const staffId = Number(localStorage.getItem("staffId"));

  return (
    <div className="meeting-list">
      <h3>Meeting List</h3>

      <div className="meeting-list-container">
        {meetings.length === 0 && (
          <p className="empty-state">No meetings available for you.</p>
        )}

        {meetings.map((m) => {
          const isSelected = selectedMeetingId === m.MeetingID;
          
          const canEdit = role === "Admin" || (role === "Convener");

          return (
            <div
              key={m.MeetingID}
              className={`meeting-item-card ${m.IsCancelled ? "cancelled" : ""} ${isSelected ? "is-editing" : ""}`}
            >
              <div className="meeting-card-content">
                <div className="meeting-info">
                  <div className="card-top">
                    <span className="type-tag">{m.MeetingTypeName || "Unknown"}</span>
                    <span className={`status-pill ${m.IsCancelled ? "status-cancelled" : "status-active"}`}>
                      {m.IsCancelled ? "Cancelled" : "Scheduled"}
                    </span>
                  </div>
                  <h4>{m.MeetingDescription}</h4>
                  <p className="meeting-date">📅 {new Date(m.MeetingDate).toLocaleString()}</p>
                </div>

                {!isSelected && (role === "Admin" || role === "Convener") && (
                  <div className="meeting-actions">
                    {canEdit && !m.IsCancelled && (
                      <button
                        className="btn-edit-action"
                        onClick={() => onEdit(m)}
                      >
                        Edit
                      </button>
                    )}

                    {!m.IsCancelled && (
                      <button
                        className="btn-cancel-action"
                        onClick={() => onCancel(m.MeetingID)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="inline-edit-portal animate-slide-down">
                  <EditMeeting
                    meeting={m}
                    onUpdate={onUpdate}
                    onClose={() => onEdit(null)}
                    showToast={showToast}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingList;
