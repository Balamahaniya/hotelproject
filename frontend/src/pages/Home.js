import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUsername(null);
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1>Welcome to Hotel Booking</h1>

      <div className="home-links">
        {!username ? (
          <>
            <Link to="/signup" className="home-link">
              Sign Up
            </Link>
            <Link to="/login" className="home-link">
              Login
            </Link>
          </>
        ) : (
          <>
            <p style={{ color: "white", fontSize: "18px" }}>
              Welcome, <strong>{username}</strong>
            </p>
            <Link to="/website" className="home-link">
              Explore Rooms
            </Link>
            <Link to="/booking" className="home-link">
              Book a Room
            </Link>
            <Link to="/profile" className="home-link">
              My Profile
            </Link>
            <button className="btn btn-danger mt-2" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
