import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast/Toast";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staffInfo, setStaffInfo] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const role = localStorage.getItem("role");
  const staffId = Number(localStorage.getItem("staffId"));
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: localStorage.getItem("staffName") || "System User",
    email: "",
    phone: "",
    bio: role === "Staff" ? "Active participant in meetings and team discussions." : "Responsible for managing and organizing meetings."
  });

  const [passwordFlow, setPasswordFlow] = useState({
    old: "",
    new: "",
    confirm: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/staff/${staffId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setStaffInfo(data.data);
          setFormData({
            ...formData,
            name: data.data.StaffName,
            email: data.data.EmailAddress,
            phone: data.data.MobileNo
          });
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/staff/${staffId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          StaffName: formData.name,
          EmailAddress: formData.email,
          MobileNo: formData.phone,
          Remarks: staffInfo?.Remarks 
        })
      });
      const data = await response.json();
      if (data.success) {
        showToast("Profile Updated Successfully!");
        setStaffInfo({ ...staffInfo, StaffName: formData.name, EmailAddress: formData.email, MobileNo: formData.phone });
        localStorage.setItem("staffName", formData.name);
        setShowEditModal(false);
      } else {
        showToast(data.message, "error");
      }
    } catch (err) {
      showToast("Error updating profile", "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordFlow.new !== passwordFlow.confirm) {
        showToast("Passwords do not match!", "warning");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                staffId: staffId,
                oldPassword: passwordFlow.old,
                newPassword: passwordFlow.new
            })
        });
        const data = await response.json();
        if (data.success) {
            showToast("Password Changed Successfully!");
            setShowPasswordModal(false);
            setPasswordFlow({ old: "", new: "", confirm: "" });
        } else {
            showToast(data.message, "error");
        }
    } catch (err) {
        showToast("Error changing password", "error");
    }
  };

  if (loading) return <div className="loading-screen">Loading Profile...</div>;

  return (
    <div className="profile-page animate-fade-in">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      <div className="profile-header-elite">
        <h3>User Profile</h3>
        <p className="subtitle">Manage your account settings and preferences</p>
      </div>

      <div className="profile-layout-elite">
        <div className="profile-card-elite">
          <div className="profile-avatar-giant">
            {formData.name?.charAt(0)}
            <div className="avatar-status-badge"></div>
          </div>

          <div className="profile-identity">
            <h4>{formData.name}</h4>
            <span className="badge-role">{role}</span>
          </div>

          <p className="profile-bio-elite">
            {formData.bio}
          </p>

          <div className="profile-quick-actions">
            <button className="btn-elite-profile primary" onClick={() => setShowEditModal(true)}>
              <span className="icon">✏️</span> Edit Profile
            </button>
            <button className="btn-elite-profile secondary" onClick={() => setShowPasswordModal(true)}>
              <span className="icon">🔒</span> Change Password
            </button>
            <button className="btn-elite-profile danger" onClick={handleLogout}>
              <span className="icon">🚪</span> Logout
            </button>
          </div>
        </div>

        <div className="profile-main-content">
          <div className="details-grid-elite">
            <div className="info-card-elite">
              <div className="card-header-elite">
                <h5>Basic Information</h5>
              </div>
              <div className="info-rows">
                <div className="info-row">
                  <span className="label">Full Name</span>
                  <span className="value">{formData.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email Address</span>
                  <span className="value">{formData.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Mobile Number</span>
                  <span className="value">{formData.phone}</span>
                </div>
              </div>
            </div>

            <div className="info-card-elite">
              <div className="card-header-elite">
                <h5>Work & Security</h5>
              </div>
              <div className="info-rows">
                <div className="info-row">
                  <span className="label">Employee ID</span>
                  <span className="value">EMP-{staffId}</span>
                </div>
                <div className="info-row">
                  <span className="label">Department</span>
                  <span className="value">{staffInfo?.Department || "General Operations"}</span>
                </div>
                <div className="info-row">
                  <span className="label">Account Status</span>
                  <span className="value status-active">Active</span>
                </div>
              </div>
            </div>
          </div>

          <div className="support-mega-card animate-slide-up">
            <div className="support-header">
              <div className="icon-circle">🎧</div>
              <div>
                <h5>Site Support & Growth</h5>
                <p>Access help resources and system documentation</p>
              </div>
            </div>

            <div className="support-grid-lite">
              <div className="support-item">
                <span className="item-icon">📧</span>
                <div>
                  <h6>Technical Helpline</h6>
                  <p>support@mom-elite.com</p>
                </div>
              </div>
              <div className="support-item">
                <span className="item-icon">📞</span>
                <div>
                  <h6>Emergency Contact</h6>
                  <p>+91 98765-43210</p>
                </div>
              </div>
              <div className="support-item">
                <span className="item-icon">📖</span>
                <div>
                  <h6>MOM Guidebook</h6>
                  <p>View System Manual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay-elite animate-fade-in" onClick={() => setShowEditModal(false)}>
          <div className="modal-content-elite animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Edit Profile Information</h4>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group-elite">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group-elite">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group-elite">
                <label>Mobile Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group-elite">
                <label>Bio / Description</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-elite-profile secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-elite-profile primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal-overlay-elite animate-fade-in" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content-elite animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Secure Password Change</h4>
              <p className="subtitle">Verify your identity before changing password</p>
              <button className="close-btn" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group-elite">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter old password"
                  value={passwordFlow.old}
                  onChange={(e) => setPasswordFlow({ ...passwordFlow, old: e.target.value })}
                  required
                />
              </div>
              <div className="form-divider"></div>
              <div className="form-group-elite">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={passwordFlow.new}
                  onChange={(e) => setPasswordFlow({ ...passwordFlow, new: e.target.value })}
                  required
                />
              </div>
              <div className="form-group-elite">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-type new password"
                  value={passwordFlow.confirm}
                  onChange={(e) => setPasswordFlow({ ...passwordFlow, confirm: e.target.value })}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-elite-profile secondary" onClick={() => setShowPasswordModal(false)}>Discard</button>
                <button type="submit" className="btn-elite-profile primary">Update Security</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
