import { useState, useEffect, useCallback } from "react";
import Toast from "../components/Toast/Toast";
import "./Attendance.css";

const Attendance = () => {
  const [allMeetings, setAllMeetings] = useState([]);
  const [myMeetings, setMyMeetings] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [meetingMembers, setMeetingMembers] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const currentStaffId = Number(localStorage.getItem("staffId"));

  const fetchData = async () => {
    try {
      const respM = await fetch("http://localhost:5000/api/meetings", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataM = await respM.json();
      if (dataM.success) setAllMeetings(dataM.data);

      const respMyHistory = await fetch("http://localhost:5000/api/meetings/my-history", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataMyHistory = await respMyHistory.json();
      if (dataMyHistory.success) setMyMeetings(dataMyHistory.data);

      const respS = await fetch("http://localhost:5000/api/staff", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataS = await respS.json();
      if (dataS.success) setAllStaff(dataS.data);

    } catch (err) {
      console.error("Attendance Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }
    fetchData();
  }, []);

  const fetchMeetingMembers = async (mid) => {
    try {
      const resp = await fetch(`http://localhost:5000/api/meeting-members/meeting/${mid}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await resp.json();
      if (data.success) {
        setMeetingMembers(data.data);
      }
    } catch (err) {
      console.error("Members Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (selectedMeetingId) {
      fetchMeetingMembers(selectedMeetingId);
    }
  }, [selectedMeetingId]);

  const handleToggleAttendance = async (mmId, currentStatus, remarks) => {
    if (role === "Staff") return;
    
    setMeetingMembers(prev => 
      prev.map(mm => mm.MeetingMemberID === mmId ? { ...mm, IsPresent: currentStatus ? 0 : 1 } : mm)
    );

    try {
      const response = await fetch(`http://localhost:5000/api/meeting-members/${mmId}/attendance`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ IsPresent: currentStatus ? 0 : 1, Remarks: remarks || null })
      });
      const data = await response.json();
      if (!data.success) {
        showToast(data.message || "Failed to toggle attendance", "error");
        fetchMeetingMembers(selectedMeetingId);
      }
    } catch (err) {
      showToast("Error updating attendance", "error");
      fetchMeetingMembers(selectedMeetingId);
    }
  };

  const handleUpdateRemarks = async (mmId, status, remarks) => {
    try {
      await fetch(`http://localhost:5000/api/meeting-members/${mmId}/attendance`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ IsPresent: status, Remarks: remarks || null })
      });
    } catch (err) {}
  };

  const handleAddMember = async (staffId) => {
    if (role === "Staff") return;
    const exists = meetingMembers.find(mm => mm.StaffID === staffId);
    if (exists) {
      showToast("Staff is already a member!", "warning");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/meeting-members/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          MeetingID: Number(selectedMeetingId),
          StaffID: staffId,
          IsPresent: 1,
          Remarks: null
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchMeetingMembers(selectedMeetingId);
      } else {
        showToast(data.message || "Failed to add member", "error");
      }
    } catch (err) {
      showToast("Error adding member", "error");
    }
  };

  const [me, setMe] = useState(null);

  useEffect(() => {
    if (token) {
        fetch(`http://localhost:5000/api/staff/${currentStaffId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) setMe(data.data);
        })
        .catch(() => {});
    }
  }, [token, currentStaffId]);

  const selectedMeeting = allMeetings.find(m => m.MeetingID === Number(selectedMeetingId));

  if (loading) return <div className="loading-screen">Loading Attendance...</div>;

  return (
    <div className="attendance-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      <div className="attendance-header">
        <h3>Attendance</h3>
        <p className="subtitle">
          {role === "Staff" ? "Track your participation and records" : "Manage meeting attendance and track your own records"}
        </p>
      </div>

      <div className="personal-section">
        <div className="section-title-elite">
          <span className="eyebrow">MY ACCOUNT</span>
          <h4>Personal Attendance Dashboard</h4>
        </div>

        <div className="staff-profile-card animate-fade-in">
          <div className="staff-avatar-large">{me?.StaffName?.charAt(0) || localStorage.getItem("staffName")?.charAt(0)}</div>
          <div className="staff-details-prime">
            <h4>{me?.StaffName || localStorage.getItem("staffName")}</h4>
            <div className="staff-meta-grid">
              <div className="meta-item">
                <span className="label">ROLE</span>
                <span className="value">{me?.Role || localStorage.getItem("role")}</span>
              </div>
              <div className="meta-item">
                <span className="label">EMAIL</span>
                <span className="value">{me?.EmailAddress || "Loading..."}</span>
              </div>
              <div className="meta-item">
                <span className="label">MOBILE</span>
                <span className="value">{me?.MobileNo || "Loading..."}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="attendance-log-section">
          <h4 className="log-heading">My Meeting History</h4>
          <div className="personal-log-list animate-fade-in">
            {myMeetings.length > 0 ? (
              myMeetings.map(m => (
                <div key={m.MeetingID} className="attendance-log-entry">
                  <div className="log-date-pill">
                    <span className="log-month">{new Date(m.MeetingDate).toLocaleString('default', { month: 'short' })}</span>
                    <span className="log-day">{new Date(m.MeetingDate).getDate()}</span>
                  </div>
                  <div className="log-main-info">
                    <h5>{m.MeetingDescription}</h5>
                    <p className="log-type">{m.MeetingTypeName}</p>
                    <p className="log-venue">📍 {m.Venue}</p>
                  </div>
                  <div className={`log-badge ${m.IsCancelled ? 'absent' : (m.IsPresent ? 'present' : 'absent')}`}>
                    {m.IsCancelled ? 'CANCELLED' : (m.IsPresent ? 'PRESENT' : 'ABSENT')}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No meeting records found for your account.</div>
            )}
          </div>
        </div>
      </div>

      {role !== "Staff" && (
        <div className="management-section animate-slide-up">
          <div className="section-divider"></div>

          <div className="section-title-elite">
            <span className="eyebrow">MANAGEMENT</span>
            <h4>Attendance Control Center Interface</h4>
          </div>

          <div className="attendance-steps">
            <div className={`step-node ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)}>1. Select Meeting</div>
            <div className={`step-node ${step >= 2 ? 'active' : ''}`} onClick={() => selectedMeetingId && setStep(2)}>2. Manage Members</div>
            <div className={`step-node ${step >= 3 ? 'active' : ''}`} onClick={() => selectedMeetingId && setStep(3)}>3. Mark Attendance</div>
          </div>

          <div className="attendance-content card">
            {step === 1 && (
              <div className="step-selection animate-fade-in">
                <h4>Select a Meeting to Begin</h4>
                <div className="meeting-grid">
                  {allMeetings.filter(m => !m.IsCancelled).map(m => (
                    <div
                      key={m.MeetingID}
                      className={`meeting-card ${selectedMeetingId === String(m.MeetingID) ? 'selected' : ''}`}
                      onClick={() => { setSelectedMeetingId(String(m.MeetingID)); setStep(2); }}
                    >
                      <h5>{m.MeetingDescription}</h5>
                      <p>{new Date(m.MeetingDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {allMeetings.filter(m => !m.IsCancelled).length === 0 && <div className="empty-state">No active meetings found.</div>}
                </div>
              </div>
            )}

            {step === 2 && selectedMeeting && (
              <div className="step-members animate-fade-in">
                <div className="step-header">
                  <h4>Participants for: {selectedMeeting.MeetingDescription}</h4>
                  <button className="btn-primary" onClick={() => setStep(3)}>Next: Mark Attendance</button>
                </div>

                <div className="members-layout">
                  <div className="current-members">
                    <h5>Current Members ({meetingMembers.length})</h5>
                    <ul>
                      {meetingMembers.map(mm => (
                        <li key={mm.MeetingMemberID}>{mm.StaffName}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="staff-pool">
                    <h5>Available Staff</h5>
                    <div className="staff-chips">
                      {allStaff.map(s => (
                        <button key={s.StaffID} className="staff-chip" onClick={() => handleAddMember(s.StaffID)}>
                          + {s.StaffName}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && selectedMeeting && (
              <div className="step-participation animate-fade-in">
                <div className="step-header">
                  <h4>Mark Attendance</h4>
                  <button className="btn-primary" onClick={() => showToast("Attendance Saved!")}>Finish</button>
                </div>

                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Staff Name</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetingMembers.map(mm => (
                      <tr key={mm.MeetingMemberID}>
                        <td>{mm.StaffName}</td>
                        <td>
                          <button
                            className={`status-btn ${mm.IsPresent ? 'present' : 'absent'}`}
                            onClick={() => handleToggleAttendance(mm.MeetingMemberID, mm.IsPresent, mm.Remarks)}
                          >
                            {mm.IsPresent ? 'Present' : 'Absent'}
                          </button>
                        </td>
                        <td>
                          <input
                            placeholder="Remarks..."
                            className="table-input"
                            defaultValue={mm.Remarks}
                            onBlur={(e) => handleUpdateRemarks(mm.MeetingMemberID, mm.IsPresent, e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
