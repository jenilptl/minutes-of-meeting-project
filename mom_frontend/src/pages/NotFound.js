import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "70vh",
      textAlign: "center",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "5rem", color: "#e74c3c", margin: "0" }}>404</h1>
      <h2 style={{ color: "#2c3e50" }}>Oops! Page Not Found</h2>
      <p style={{ color: "#7f8c8d", maxWidth: "500px" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button 
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "10px 25px",
          backgroundColor: "#2a9d8f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default NotFound;
