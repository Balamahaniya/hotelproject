import React from "react";
import { useNavigate } from "react-router-dom";
import twoBed from "./2bed.jpg";
import twoBedNonAc from "./2bednac.jpg";
import fourBed from "./4bed.jpg";
import fourBedNonAc from "./4bednac.jpg";
import "./Website.css";

const Website = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleBooking = () => {
    navigate("/booking");
  };

  return (
    <div className="website-container">
      <div className="header-section">
        <h2>Welcome, {username}</h2>
        <div className="header-buttons">
          <button className="btn btn-outline-primary" onClick={() => navigate("/profile")}>
            My Profile
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <h3 className="text-center">Choose Your Room Type</h3>

      <div className="room-types">
        <div className="room-card">
          <img src={twoBed} alt="2-Bed AC Room" className="room-image" />
          <div className="room-body">
            <div className="room-title">2-Bed AC Room</div>
            <div className="room-price">₹2000 per night</div>
            <button className="book-now-btn" onClick={handleBooking}>
              Book Now
            </button>
          </div>
        </div>

        <div className="room-card">
          <img src={twoBedNonAc} alt="2-Bed Non-AC Room" className="room-image" />
          <div className="room-body">
            <div className="room-title">2-Bed Non-AC Room</div>
            <div className="room-price">₹1500 per night</div>
            <button className="book-now-btn" onClick={handleBooking}>
              Book Now
            </button>
          </div>
        </div>

        <div className="room-card">
          <img src={fourBed} alt="4-Bed AC Room" className="room-image" />
          <div className="room-body">
            <div className="room-title">4-Bed AC Room</div>
            <div className="room-price">₹3000 per night</div>
            <button className="book-now-btn" onClick={handleBooking}>
              Book Now
            </button>
          </div>
        </div>

        <div className="room-card">
          <img src={fourBedNonAc} alt="4-Bed Non-AC Room" className="room-image" />
          <div className="room-body">
            <div className="room-title">4-Bed Non-AC Room</div>
            <div className="room-price">₹2500 per night</div>
            <button className="book-now-btn" onClick={handleBooking}>
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Website;
