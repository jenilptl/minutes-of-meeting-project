import { useState, useEffect } from "react";
import "./EditMeeting.css";

const EditMeeting = ({ meeting, onUpdate, onClose, showToast }) => {
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    MeetingDate: "",
    MeetingTypeID: "",
    MeetingDescription: "",
    Venue: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/meeting-types", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) setTypes(data.data);
      } catch (err) {}
    };
    fetchTypes();

    if (meeting) {
      setFormData({
        MeetingDate: meeting.MeetingDate,
        MeetingTypeID: meeting.MeetingTypeID,
        MeetingDescription: meeting.MeetingDescription,
        Venue: meeting.Venue || ""
      });
    }
  }, [meeting, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/meetings/${meeting.MeetingID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          MeetingDate: formData.MeetingDate,
          MeetingTypeID: Number(formData.MeetingTypeID),
          MeetingDescription: formData.MeetingDescription,
          Venue: formData.Venue
        })
      });
      const data = await response.json();
      if (data.success) {
        if (showToast) showToast("Meeting updated successfully!");
        onUpdate();
      } else {
        if (showToast) showToast(data.message, "error");
      }
    } catch (err) {
      if (showToast) showToast("Error updating meeting", "error");
    }
  };

  return (
    <div className="edit-meeting">
      <h3>Edit Meeting Details</h3>

      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Meeting Date & Time</label>
          <input
            type="datetime-local"
            name="MeetingDate"
            value={formData.MeetingDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Meeting Type</label>
          <select
            name="MeetingTypeID"
            value={formData.MeetingTypeID}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            {types.map((t) => (
              <option key={t.MeetingTypeID} value={t.MeetingTypeID}>
                {t.MeetingTypeName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Venue</label>
          <input
            type="text"
            name="Venue"
            value={formData.Venue}
            onChange={handleChange}
            placeholder="Enter venue"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="MeetingDescription"
            rows="3"
            value={formData.MeetingDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="edit-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="submit"
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMeeting;
