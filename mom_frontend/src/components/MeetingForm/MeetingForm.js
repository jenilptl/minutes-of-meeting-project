import { useState, useEffect } from "react";
import "./MeetingForm.css";

const MeetingForm = ({ onAddMeeting }) => {
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    meetingDate: "",
    meetingType: "",
    meetingDescription: "",
    venue: "",
    document: null
  });

  useEffect(() => {
    const fetchTypes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/meeting-types", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setTypes(data.data);
        }
      } catch (err) {
        console.error("Fetch Meeting Types Error:", err);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      document: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMeeting = {
      MeetingDate: formData.meetingDate,
      MeetingTypeID: Number(formData.meetingType),
      MeetingDescription: formData.meetingDescription,
      Venue: formData.venue,
      DocumentPath: formData.document ? formData.document.name : ""
    };

    onAddMeeting(newMeeting);

    setFormData({
      meetingDate: "",
      meetingType: "",
      meetingDescription: "",
      venue: "",
      document: null
    });
  };

  return (
    <div className="meeting-form">
      <h3>Add Meeting</h3>

      <form className="meeting-form-ui" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Meeting Date & Time</label>
          <input
            type="datetime-local"
            name="meetingDate"
            value={formData.meetingDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Meeting Type</label>
          <select
            name="meetingType"
            value={formData.meetingType}
            onChange={handleChange}
            required
          >
            <option value="">Select Meeting Type</option>
            {types.map(t => (
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
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Enter venue"
            required
          />
        </div>

        <div className="form-group">
          <label>Meeting Description</label>
          <textarea
            name="meetingDescription"
            rows="3"
            value={formData.meetingDescription}
            onChange={handleChange}
            placeholder="Enter meeting agenda or description"
            required
          />
        </div>

        <div className="form-group">
          <label>Document (optional)</label>
          <input
            type="file"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              setFormData({
                meetingDate: "",
                meetingType: "",
                meetingDescription: "",
                venue: "",
                document: null
              })
            }
          >
            Clear
          </button>

          <button type="submit" className="btn-primary">
            Add Meeting
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeetingForm;
