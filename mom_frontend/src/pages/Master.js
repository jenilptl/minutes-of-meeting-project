import { useState, useEffect, useCallback } from "react";
import Toast from "../components/Toast/Toast";
import "./Master.css";

const Master = () => {
  const role = localStorage.getItem("role") || "Staff";
  const token = localStorage.getItem("token");

  const [types, setTypes] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [meetingMembers, setMeetingMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const [showAddTypeForm, setShowAddTypeForm] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeRemarks, setNewTypeRemarks] = useState("");

  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffMobile, setNewStaffMobile] = useState("");
  const [newStaffDept, setNewStaffDept] = useState("");
  const [newStaffPass, setNewStaffPass] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Staff");
  const [newStaffRemarks, setNewStaffRemarks] = useState("");

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [cancelMeetingId, setCancelMeetingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); 
  
  const [editingStaff, setEditingStaff] = useState(null); // ID of staff being edited
  const [editStaffForm, setEditStaffForm] = useState({
    StaffName: "",
    EmailAddress: "",
    MobileNo: "",
    Department: "",
    Role: "",
    Remarks: ""
  });
  const fetchData = async () => {
    try {
      const respTypes = await fetch("http://localhost:5000/api/meeting-types", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataTypes = await respTypes.json();
      if (dataTypes.success) setTypes(dataTypes.data);

      const respStaff = await fetch("http://localhost:5000/api/staff", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataStaff = await respStaff.json();
      if (dataStaff.success) setStaffList(dataStaff.data);

      const respMeetings = await fetch("http://localhost:5000/api/meetings", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const dataMeetings = await respMeetings.json();
      if (dataMeetings.success) setMeetings(dataMeetings.data);

    } catch (err) {
      console.error("Master Fetch Error:", err);
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

  const handleAddType = async (e) => {
    e.preventDefault();
    if (!newTypeName) return;

    try {
      const response = await fetch("http://localhost:5000/api/meeting-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          MeetingTypeName: newTypeName,
          Remarks: newTypeRemarks
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast("Meeting type added");
        setNewTypeName("");
        setNewTypeRemarks("");
        setShowAddTypeForm(false);
        fetchData();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Error adding meeting type", "error");
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail || !newStaffMobile || !newStaffPass) return;

    try {
      const response = await fetch("http://localhost:5000/api/staff/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          StaffName: newStaffName,
          EmailAddress: newStaffEmail,
          MobileNo: newStaffMobile,
          Department: newStaffDept,
          password: newStaffPass,
          Role: newStaffRole,
          Remarks: newStaffRemarks || "General"
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast("Staff onboarded successfully");
        setNewStaffName(""); setNewStaffEmail(""); setNewStaffMobile("");
        setNewStaffDept(""); setNewStaffPass(""); setNewStaffRole("Staff");
        setNewStaffRemarks(""); setShowAddStaffForm(false);
        fetchData();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Error onboarding staff", "error");
    }
  };

  const handleDeleteMeeting = async (id) => {
    setConfirmDelete({ type: "meeting", id });
  };

  const doDeleteMeeting = async (id) => {
    setConfirmDelete(null);
    try {
      const response = await fetch(`http://localhost:5000/api/meetings/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        showToast("Meeting deleted");
        fetchData();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Error deleting meeting", "error");
    }
  };

  const handleCancelClick = (id) => {
    setCancelMeetingId(id);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) { showToast("Please provide a cancellation reason", "warning"); return; }
    try {
      const response = await fetch(`http://localhost:5000/api/meetings/${cancelMeetingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ IsCancelled: 1, CancellationReason: cancelReason })
      });
      const data = await response.json();
      if (data.success) {
        setShowCancelModal(false);
        setCancelMeetingId(null);
        fetchData();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Error cancelling meeting", "error");
    }
  };

  const handleDeleteStaff = async (id) => {
    if (role !== "Admin") { showToast("Only Admin can delete staff", "warning"); return; }
    setConfirmDelete({ type: "staff", id });
  };

  const doDeleteStaff = async (id) => {
    setConfirmDelete(null);
    try {
      const response = await fetch(`http://localhost:5000/api/staff/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        showToast("Staff removed successfully");
        fetchData();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Error deleting staff", "error");
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff.StaffID);
    setEditStaffForm({
      StaffName: staff.StaffName,
      EmailAddress: staff.EmailAddress,
      MobileNo: staff.MobileNo,
      Department: staff.Department || "",
      Role: staff.Role,
      Remarks: staff.Remarks || ""
    });
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/staff/${editingStaff}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(editStaffForm)
      });
      const data = await response.json();
      if (data.success) {
        showToast("Staff updated successfully");
        setEditingStaff(null);
        fetchData();
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Error updating staff", "error");
    }
  };

  const handleViewReport = async (meeting) => {
    setSelectedMeeting(meeting);
    
    try {
      const response = await fetch(`http://localhost:5000/api/meeting-members/meeting/${meeting.MeetingID}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMeetingMembers(data.data);
      } else {
        setMeetingMembers([]);
      }
    } catch (err) {
      setMeetingMembers([]);
    }
    setShowReport(true);
  };

  const getTypeName = (id) => {
    const type = types.find(t => t.MeetingTypeID === id);
    return type ? type.MeetingTypeName : "Unknown";
  };

  const getStaffName = (id) => {
    const s = staffList.find(s => s.StaffID === id);
    return s ? s.StaffName : "Unknown";
  };

  if (loading) return <div className="loading-screen">Loading Master Data...</div>;

  const getAttendanceForMeeting = (id) => {
    return meetingMembers; 
  };

  return (
    <div className="master-page animate-fade-in">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />

      {confirmDelete && (
        <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: 6, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ flex: 1, fontSize: 14 }}>
            {confirmDelete.type === "meeting" ? "Delete this meeting? This cannot be undone." : "Remove this staff member? This cannot be undone."}
          </span>
          <button
            onClick={() => confirmDelete.type === "meeting" ? doDeleteMeeting(confirmDelete.id) : doDeleteStaff(confirmDelete.id)}
            style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: 4, padding: "5px 14px", cursor: "pointer", fontSize: 13 }}
          >Yes, Delete</button>
          <button
            onClick={() => setConfirmDelete(null)}
            style={{ background: "#6c757d", color: "#fff", border: "none", borderRadius: 4, padding: "5px 14px", cursor: "pointer", fontSize: 13 }}
          >No, Cancel</button>
        </div>
      )}

      <div className="master-header-elite">
        <div className="header-info">
          <h3>Master Configuration</h3>
          <p className="subtitle">Configure organizational settings and expand your staff base</p>
        </div>

        {role === "Admin" && (
          <div className="header-actions">
            <button
              className={`btn-elite-master ${showAddTypeForm ? 'active' : ''}`}
              onClick={() => { setShowAddTypeForm(!showAddTypeForm); setShowAddStaffForm(false); }}
            >
              {showAddTypeForm ? "✕ Close" : "+ Add Meeting Type"}
            </button>
            <button
              className={`btn-elite-master secondary ${showAddStaffForm ? 'active' : ''}`}
              onClick={() => { setShowAddStaffForm(!showAddStaffForm); setShowAddTypeForm(false); }}
            >
              {showAddStaffForm ? "✕ Close" : "+ Add Member"}
            </button>
          </div>
        )}
      </div>

      {showAddTypeForm && (
        <div className="master-form-elite animate-slide-down">
          <div className="form-header">
            <h4>Add New Meeting Type</h4>
          </div>
          <form onSubmit={handleAddType} className="elite-form-row">
            <div className="form-group-elite-master">
              <label>Type Name</label>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="e.g. Board of Trustees"
                required
              />
            </div>
            <div className="form-group-elite-master">
              <label>Category / Remarks</label>
              <input
                type="text"
                value={newTypeRemarks}
                onChange={(e) => setNewTypeRemarks(e.target.value)}
                placeholder="Brief description..."
              />
            </div>
            <button type="submit" className="btn-save-elite">Save Meeting Type</button>
          </form>
        </div>
      )}

      {showAddStaffForm && (
        <div className="master-form-elite staff-form-accent animate-slide-down">
          <div className="form-header">
            <h4>Onboard New Staff Member</h4>
          </div>
          <form onSubmit={handleAddStaff} className="elite-form-grid">
            <div className="form-group-elite-master">
              <label>Full Name</label>
              <input
                type="text"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="Enter formal name"
                required
              />
            </div>
            <div className="form-group-elite-master">
              <label>Department</label>
              <input
                type="text"
                value={newStaffDept}
                onChange={(e) => setNewStaffDept(e.target.value)}
                placeholder="e.g. Engineering"
                required
              />
            </div>
            <div className="form-group-elite-master">
              <label>Email Address</label>
              <input
                type="email"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                placeholder="official.email@org.com"
                required
              />
            </div>
            <div className="form-group-elite-master">
              <label>Mobile Number</label>
              <input
                type="text"
                value={newStaffMobile}
                onChange={(e) => setNewStaffMobile(e.target.value)}
                placeholder="Enter mobile"
                required
              />
            </div>
            <div className="form-group-elite-master">
              <label>Password</label>
              <input
                type="password"
                value={newStaffPass}
                onChange={(e) => setNewStaffPass(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-group-elite-master">
              <label>Role</label>
              <select
                value={newStaffRole}
                onChange={(e) => setNewStaffRole(e.target.value)}
              >
                <option value="Staff">Staff</option>
                <option value="Convener">Convener</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="form-group-elite-master full-width">
              <label>Remarks / Position</label>
              <input
                type="text"
                value={newStaffRemarks}
                onChange={(e) => setNewStaffRemarks(e.target.value)}
                placeholder="e.g. Senior Representative"
              />
            </div>
            <div className="form-actions-elite">
              <button type="submit" className="btn-save-elite accent">Onboard Member</button>
            </div>
          </form>
        </div>
      )}

      <div className="master-grid">
        <section className="master-section-elite">
          <div className="section-header-elite">
            <div className="icon-box-master">📁</div>
            <div>
              <h4>Meeting Types</h4>
              <p>Organizational categories for all sessions</p>
            </div>
            <span className="count-pill">{types.length} Types</span>
          </div>

          <div className="card-grid-elite">
            {types.map((type) => (
              <div key={type.MeetingTypeID} className="master-card-elite animate-fade-in">
                <div className="card-content">
                  <h5>{type.MeetingTypeName}</h5>
                  <p>{type.Remarks || "Standard Meeting Category"}</p>
                </div>
                <div className="card-accent-line"></div>
              </div>
            ))}
          </div>
        </section>

        <section className="master-section-elite">
          <div className="section-header-elite">
            <div className="icon-box-master">👥</div>
            <div>
              <h4>Staff Base</h4>
              <p>Registered members and their system roles</p>
            </div>
            <span className="count-pill">{staffList.length} Members</span>
          </div>

          <div className="card-grid-elite scrollable-card-grid">
            {staffList.map((s) => (
              <div key={s.StaffID} className="master-card-elite staff-lite animate-fade-in">
                <div className="staff-avatar-lite">
                  {s.StaffName.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="card-content">
                  <h5>{s.StaffName}</h5>
                  <p className="staff-email-lite">{s.EmailAddress}</p>
                  <span className="staff-role-pill">{s.Remarks}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <hr className="master-divider" />

      {role === "Admin" && (
        <div className="operations-console">
          <h3>Operations Console</h3>
          <p>Advanced Management & Reporting (Admin)</p>

          <div className="console-grid">

            <div className="console-panel">
              <div className="panel-header">
                <h4>Meeting Management</h4>
                <span className="panel-badge">{meetings.length}</span>
              </div>
              <div className="panel-scroll-area">
                {meetings.map(meeting => (
                  <div key={meeting.MeetingID} className={`console-row ${meeting.IsCancelled ? 'cancelled' : ''}`}>
                    <div className="row-info">
                      <strong>{meeting.MeetingDescription}</strong>
                      <span>{meeting.MeetingDate} | {getTypeName(meeting.MeetingTypeID)}</span>
                      <span className={`status-text ${meeting.IsCancelled ? 'red' : 'green'}`}>
                        {meeting.IsCancelled ? 'Cancelled' : 'Scheduled'}
                      </span>
                    </div>
                    <div className="row-actions">
                      <button onClick={() => handleViewReport(meeting)} className="btn-tiny blue">Report</button>
                      {role === "Admin" && (
                        <>
                          {!meeting.IsCancelled && (
                            <button onClick={() => handleCancelClick(meeting.MeetingID)} className="btn-tiny orange">Cancel</button>
                          )}
                          <button onClick={() => handleDeleteMeeting(meeting.MeetingID)} className="btn-tiny red">Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="console-panel">
              <div className="panel-header">
                <h4>Staff Database (Admin)</h4>
                <span className="panel-badge">{staffList.length}</span>
              </div>
              <div className="panel-scroll-area">
                {staffList.map(staff => (
                  <div key={staff.StaffID} className="console-row">
                    {editingStaff === staff.StaffID ? (
                      <form onSubmit={handleUpdateStaff} className="inline-edit-form">
                        <div className="edit-form-grid">
                          <input
                            type="text"
                            value={editStaffForm.StaffName}
                            onChange={(e) => setEditStaffForm({ ...editStaffForm, StaffName: e.target.value })}
                            placeholder="Name"
                            required
                          />
                          <input
                            type="email"
                            value={editStaffForm.EmailAddress}
                            onChange={(e) => setEditStaffForm({ ...editStaffForm, EmailAddress: e.target.value })}
                            placeholder="Email"
                            required
                          />
                          <input
                            type="text"
                            value={editStaffForm.MobileNo}
                            onChange={(e) => setEditStaffForm({ ...editStaffForm, MobileNo: e.target.value })}
                            placeholder="Mobile"
                            required
                          />
                          <input
                            type="text"
                            value={editStaffForm.Department}
                            onChange={(e) => setEditStaffForm({ ...editStaffForm, Department: e.target.value })}
                            placeholder="Dept"
                          />
                          <select
                            value={editStaffForm.Role}
                            onChange={(e) => setEditStaffForm({ ...editStaffForm, Role: e.target.value })}
                          >
                            <option value="Staff">Staff</option>
                            <option value="Convener">Convener</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <input
                            type="text"
                            value={editStaffForm.Remarks}
                            onChange={(e) => setEditStaffForm({ ...editStaffForm, Remarks: e.target.value })}
                            placeholder="Remarks"
                          />
                        </div>
                        <div className="edit-form-actions">
                          <button type="submit" className="btn-tiny green">Save</button>
                          <button type="button" onClick={() => setEditingStaff(null)} className="btn-tiny gray">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="row-info">
                          <strong>{staff.StaffName}</strong>
                          <span>{staff.EmailAddress}</span>
                          <small>{staff.Role} | {staff.Department || 'General'}</small>
                        </div>
                        <div className="row-actions">
                          {role === "Admin" && (
                            <>
                              <button onClick={() => handleEditStaff(staff)} className="btn-tiny blue">Edit</button>
                              <button onClick={() => handleDeleteStaff(staff.StaffID)} className="btn-tiny red">Remove</button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-pop">
            <h3>Cancel Meeting</h3>
            <p>Reason for cancellation:</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter reason..."
              rows={3}
            />
            <div className="modal-actions">
              <button onClick={() => setShowCancelModal(false)} className="btn-secondary">Close</button>
              <button onClick={submitCancel} className="btn-danger">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showReport && selectedMeeting && (
        <div className="modal-overlay">
          <div className="modal-content report-modal animate-pop">
            <div className="report-header">
              <h3>Meeting Full Report</h3>
              <button onClick={() => setShowReport(false)} className="close-btn">×</button>
            </div>

            <div className="report-body">
              <div className="report-row"><strong>Topic:</strong> <span>{selectedMeeting.MeetingDescription}</span></div>
              <div className="report-row"><strong>Date:</strong> <span>{selectedMeeting.MeetingDate}</span></div>
              <div className="report-row"><strong>Type:</strong> <span>{getTypeName(selectedMeeting.MeetingTypeID)}</span></div>
              <div className="report-row"><strong>Department:</strong> <span>{selectedMeeting.Department || "N/A"}</span></div>
              <div className="report-row"><strong>Presenter:</strong> <span>{selectedMeeting.Presenter || "N/A"}</span></div>
              <div className="report-row"><strong>Decision:</strong> <span>{selectedMeeting.Decision || "Pending"}</span></div>

              {selectedMeeting.IsCancelled && (
                <div className="cancellation-info">
                  <strong>Cancelled:</strong> {selectedMeeting.CancellationReason} <br />
                  <small>at {selectedMeeting.CancellationDateTime}</small>
                </div>
              )}

              <div className="attendance-section">
                <h4>Attendance Log</h4>
                <div className="att-simple-list">
                  {getAttendanceForMeeting(selectedMeeting.MeetingID).map(record => (
                    <div key={record.MeetingMemberID} className={`att-row-simple ${record.IsPresent ? 'p' : 'a'}`}>
                      <span>{getStaffName(record.StaffID)}</span>
                      <strong>{record.IsPresent ? 'Present' : 'Absent'}</strong>
                    </div>
                  ))}
                  {getAttendanceForMeeting(selectedMeeting.MeetingID).length === 0 && <p className="no-data">No records</p>}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowReport(false)} className="btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Master;
