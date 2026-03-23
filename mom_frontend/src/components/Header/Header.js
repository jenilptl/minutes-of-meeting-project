import logo from "../../assets/mom-logo.svg";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const role = localStorage.getItem("role");

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className="navbar-logo">
        <img src={logo} alt="MOM Logo" height="32" />
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/meetings">Meetings</NavLink>
        <NavLink to="/attendance">Attendance</NavLink>

        {role !== "Staff" && (
          <>
            <NavLink to="/master">Master</NavLink>
            <NavLink to="/reports">Reports</NavLink>
          </>
        )}

        <NavLink to="/profile">Profile</NavLink>
      </div>
    </nav>
  );
};

export default Header;
