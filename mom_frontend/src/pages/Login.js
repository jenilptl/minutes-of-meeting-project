import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import brandLogo from "../assets/mom-login-brand.svg";
const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Staff");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: role,
          mobileNo: mobile,
          password: password
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
      } else {
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("staffId", data.user.id);
        localStorage.setItem("staffName", data.user.name);
        localStorage.setItem("isLoggedIn", "true");

        navigate("/dashboard");
      }

    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <img src={brandLogo} alt="MOM Brand" />
        </div>

        <div className="login-form-box">
          <h3>Sign in to MOM</h3>
          <p className="subtitle">Enter your credentials to manage meetings</p>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Login As</label>
              <div className="role-options">
                {["Admin", "Convener", "Staff"].map((r) => (
                  <label key={r}>
                    <input
                      type="radio"
                      value={r}
                      checked={role === r}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="btn-primary full">
              Login
            </button>

            <p className="signup-text">
              Don’t have an account?
              <span onClick={() => navigate("/signup")}>
                {" "}Sign up
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
