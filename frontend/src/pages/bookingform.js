import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./bookingform.css";
import bgVideo from "./bgvideo.mp4";
import twoBed from "./2bed.jpg";
import twoBedNonAc from "./2bednac.jpg";
import fourBed from "./4bed.jpg";
import fourBedNonAc from "./4bednac.jpg";

const ROOM_PRICES = {
  "2bed-ac": 2000,
  "2bed-non-ac": 1500,
  "4bed-ac": 3000,
  "4bed-non-ac": 2500,
};

const roomImages = {
  "2bed-ac": twoBed,
  "2bed-non-ac": twoBedNonAc,
  "4bed-ac": fourBed,
  "4bed-non-ac": fourBedNonAc,
};

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkin: "",
    checkout: "",
    roomType: "",
    comments: "",
  });

  const [username, setUsername] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [availableRooms, setAvailableRooms] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("username");
    if (!savedUser) {
      navigate("/login");
    } else {
      setUsername(savedUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    // Recalculate price and fetch availability
    const { roomType, checkin, checkout } = updatedData;
    if (roomType && checkin && checkout) {
      const inDate = new Date(checkin);
      const outDate = new Date(checkout);
      const dayDiff = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));

      if (dayDiff > 0 && ROOM_PRICES[roomType]) {
        const price = dayDiff * ROOM_PRICES[roomType];
        setTotalPrice(price);
        fetchAvailability(roomType, checkin, checkout);
      } else {
        setTotalPrice(0);
        setAvailableRooms(null);
      }
    }
  };

  const fetchAvailability = async (roomType, checkin, checkout) => {
    try {
      const res = await axios.get("https://hotelproject-rrz7.onrender.com/booking/availability", {
        params: { roomType, checkin, checkout },
      });
      if (res.data.success) {
        setAvailableRooms(res.data.remaining);
      }
    } catch (error) {
      console.error("Error fetching availability", error);
      setAvailableRooms(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://hotelproject-rrz7.onrender.com/booking/create", {
        ...formData,
        username: username,
      });

      alert(`${response.data.message}\nTotal Price: ₹${response.data.booking.totalPrice}`);
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed");
    }
  };

  const handleResetRoomType = () => {
    setFormData({ ...formData, roomType: "" });
    setTotalPrice(0);
    setAvailableRooms(null);
  };

  return (
    <div className="booking-form-page">
      {/* Background Video */}
      <video autoPlay muted loop id="bg-video">
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Form Container */}
      <div className="container booking-form">
        <div className="booking-header d-flex justify-content-between align-items-center">
          <h2 className="text-white">Hotel Room Booking</h2>
          <div className="user-info">
            <span className="text-white me-3">
              Welcome, <strong>{username}</strong>
            </span>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                localStorage.removeItem("username");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Input Fields */}
          <div className="form-group">
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="date" name="checkin" value={formData.checkin} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <input type="date" name="checkout" value={formData.checkout} onChange={handleChange} required />
          </div>

          {/* Room Type Selection */}
          {!formData.roomType ? (
            <div className="form-group">
              <select name="roomType" value={formData.roomType} onChange={handleChange} required>
                <option value="">Select Room Type</option>
                <option value="2bed-ac">2-Bed AC Room</option>
                <option value="2bed-non-ac">2-Bed Non-AC Room</option>
                <option value="4bed-ac">4-Bed AC Room</option>
                <option value="4bed-non-ac">4-Bed Non-AC Room</option>
              </select>
            </div>
          ) : (
            <div className="selected-room-info text-light mb-3">
              <p>
                <strong>Selected Room:</strong> {formData.roomType}&nbsp;&nbsp;
                <button type="button" className="btn btn-sm btn-outline-light" onClick={handleResetRoomType}>
                  Change
                </button>
              </p>
              {roomImages[formData.roomType] && (
                <img src={roomImages[formData.roomType]} alt="Room" style={{ width: "300px", height: "200px", borderRadius: "10px" }} />
              )}
            </div>
          )}

          {/* Total Price & Availability */}
          {totalPrice > 0 && (
            <div className="text-light mb-3">
              <strong>Total Price:</strong> ₹{totalPrice}
            </div>
          )}
          {availableRooms !== null && (
            <div className="text-light mb-3">
              <strong>Rooms Available:</strong> {availableRooms}
            </div>
          )}

          <div className="form-group">
            <textarea
              name="comments"
              rows="3"
              placeholder="Any special requests or comments?"
              value={formData.comments}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Submit Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
