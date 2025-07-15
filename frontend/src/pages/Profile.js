import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import resortImage from "./resort.jpg";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    setUsername(storedUsername);
    fetchBookings(storedUsername);
  }, [navigate]);

  const fetchBookings = async (user) => {
    try {
      const res = await axios.get(`https://hotelproject-rrz7.onrender.com/booking/user/${user}`);
      const sorted = (res.data.bookings || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBookings(sorted);
    } catch (error) {
      console.error("Error fetching bookings", error);
      setBookings([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div
      className="profile-page"
      style={{
        backgroundImage: `url(${resortImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        minHeight: "100vh",
        padding: "30px",
        color: "#fff",
      }}
    >
      {/* Top Bar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Profile</h2>
        <div>
          <button
            className="btn btn-outline-light me-2"
            onClick={() => navigate("/website")}
          >
            Back to Home
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Welcome User */}
      <h4>
        Welcome, <span style={{ color: "#ffc107" }}>{username}</span>
      </h4>

      {/* Booking Table */}
      <h5 className="mt-4">Your Bookings:</h5>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-striped table-dark">
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.roomType}</td>
                  <td>{new Date(booking.checkin).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkout).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        booking.status === "Confirmed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.totalPrice ? `₹${booking.totalPrice}` : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Profile;
