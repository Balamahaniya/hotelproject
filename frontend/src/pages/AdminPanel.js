import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const adminName = localStorage.getItem("username");

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  // Fetch pending bookings from backend
  const fetchPendingBookings = async () => {
    try {
      const res = await axios.get("https://hotelproject-rrz7.onrender.com/booking/pending");
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
    }
  };

  // Handle booking confirmation
  const handleConfirm = async (id) => {
    try {
      await axios.put(`https://hotelproject-rrz7.onrender.com/booking/confirm/${id}`);
      alert("✅ Booking confirmed successfully!");
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error confirming booking:", error);
      const message =
        error?.response?.data?.message || "Failed to confirm booking";
      alert("❌ " + message);
    }
  };

  // Handle booking rejection (cancel)
  const handleReject = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to reject this booking?");
    if (!confirmCancel) return;

    try {
      await axios.delete(`https://hotelproject-rrz7.onrender.com/booking/cancel/${id}`);
      alert("❌ Booking rejected (cancelled).");
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error cancelling booking:", error);
      const message =
        error?.response?.data?.message || "Failed to cancel booking";
      alert("❌ " + message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="admin-panel">
      <div className="admin-header d-flex justify-content-between align-items-center px-4 py-3 bg-dark text-white">
        <h3 className="m-0">Welcome, {adminName} (Admin)</h3>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="container mt-4">
        <h2 className="mb-4">Pending Booking Requests</h2>
        {bookings.length === 0 ? (
          <p>No pending bookings.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="card mb-3 shadow-sm">
              <div className="card-body">
                <p><strong>Name:</strong> {booking.name}</p>
                <p><strong>Room Type:</strong> {booking.roomType}</p>
                <p><strong>Check-In:</strong> {formatDate(booking.checkin)}</p>
                <p><strong>Check-Out:</strong> {formatDate(booking.checkout)}</p>
                {booking.totalPrice && (
                  <p><strong>Total Price:</strong> ₹{booking.totalPrice}</p>
                )}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => handleConfirm(booking._id)}
                  >
                    ✅ Confirm
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(booking._id)}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .admin-header {
          background-color: #343a40;
          color: white;
        }

        .admin-panel {
          min-height: 100vh;
          background: linear-gradient(to right, #f2f2f2, #e6e6e6);
        }

        .card {
          border-left: 5px solid #28a745;
        }

        .btn-danger {
          background-color: #dc3545;
          border-color: #dc3545;
        }

        .btn-success {
          background-color: #28a745;
          border-color: #28a745;
        }

        .d-flex.gap-2 > * {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
