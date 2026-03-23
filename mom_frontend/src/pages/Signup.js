import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast/Toast";
import "./Login.css";
import brandLogo from "../assets/mom-login-brand.svg";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    StaffName: "",
    Department: "",
    MobileNo: "",
    EmailAddress: "",
    Password: ""
  });

  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/staff/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          StaffName: formData.StaffName,
          Department: formData.Department,
          MobileNo: formData.MobileNo,
          EmailAddress: formData.EmailAddress,
          password: formData.Password
        })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Registration failed");
      } else {
        setToast({ message: "Signup successful! Please login.", type: "success" });
        setTimeout(() => navigate("/"), 1800);
      }

    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
      <div className="login-container">
        <div className="login-brand">
          <img src={brandLogo} alt="MOM Brand" />
        </div>

        <div className="login-form-box">
          <h3>Create MOM Account</h3>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="StaffName"
                value={formData.StaffName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="Department"
                value={formData.Department}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="EmailAddress"
                value={formData.EmailAddress}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile No</label>
              <input
                type="text"
                name="MobileNo"
                value={formData.MobileNo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-primary full">
              Sign Up
            </button>
          </form>

          <p className="signup-text">
            Already have an account?
            <span onClick={() => navigate("/")}> Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
