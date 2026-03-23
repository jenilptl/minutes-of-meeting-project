import "./Meetings.css";
import MeetingList from "../components/MeetingList/MeetingList";
import MeetingForm from "../components/MeetingForm/MeetingForm";
import MeetingCalendar from "../components/MeetingCalendar/MeetingCalendar";
import Toast from "../components/Toast/Toast";
import { useState, useEffect, useCallback } from "react";

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const fetchMeetings = async () => {
    try {
      const resp = await fetch("http://localhost:5000/api/meetings", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await resp.json();
      if (data.success) {
        setMeetings(data.data);
      }
    } catch (err) {
      console.error("Meetings Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }
    fetchMeetings();
  }, []);

  const addMeeting = async (newMeeting) => {
    try {
      const response = await fetch("http://localhost:5000/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newMeeting)
      });
      const data = await response.json();
      if (data.success) {
        showToast("Meeting scheduled successfully");
        setShowForm(false);
        fetchMeetings();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Error scheduling meeting", "error");
    }
  };

  const handleCancelMeeting = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/meetings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ IsCancelled: 1, CancellationReason: "Manually cancelled" })
      });
      const data = await response.json();
      if (data.success) {
        fetchMeetings();
      }
    } catch (err) {
      showToast("Error cancelling meeting", "error");
    }
  };

  if (loading) return <div className="loading-screen">Loading Meetings...</div>;


  return (
    <div className="meetings-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      <div className="meetings-header">
        <div className="header-info">
          <h3>Meetings</h3>
          <p className="subtitle">Manage and schedule your sessions</p>
        </div>

        {role !== "Staff" && (
          <div className="header-actions">
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Schedule Meeting"}
            </button>
          </div>
        )}
      </div>

      {showForm && role !== "Staff" && (
        <div className="inline-form-container animate-fade-in">
          <MeetingForm onAddMeeting={addMeeting} />
        </div>
      )}

      <div className="meetings-layout">
        <div className="meetings-main">
          <MeetingList
            meetings={meetings}
            onEdit={setSelectedMeeting}
            selectedMeetingId={selectedMeeting?.MeetingID}
            onCancel={handleCancelMeeting}
            showToast={showToast}
            onUpdate={() => {
              fetchMeetings();
              setSelectedMeeting(null);
            }}
          />
        </div>

        <aside className="meetings-sidebar">
          <MeetingCalendar title="Monthly Calendar" meetings={meetings} />
        </aside>
      </div>
    </div>
  );
};

export default Meetings;
