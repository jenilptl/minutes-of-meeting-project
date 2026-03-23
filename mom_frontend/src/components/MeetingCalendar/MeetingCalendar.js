import { useState } from "react";
import "./MeetingCalendar.css";

const MeetingCalendar = ({ title = "Upcoming Meetings", meetings = [] }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleMeetings = showAll
    ? meetings.slice(0, 10)
    : meetings.slice(0, 5);

  return (
    <div className="calendar-box">
      <h4 className="calendar-title">{title}</h4>

      <div className="calendar-list">
        {visibleMeetings.map((m) => (
          <div key={m.MeetingID} className="calendar-item">
            <div className="calendar-date">
              {new Date(m.MeetingDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short"
              })}
            </div>

            <div className="calendar-info">
              <p className="calendar-text">{m.MeetingDescription}</p>
              {m.IsCancelled && (
                <span className="calendar-badge">Cancelled</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {meetings.length > 5 && (
        <button
          className="calendar-toggle"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default MeetingCalendar;
