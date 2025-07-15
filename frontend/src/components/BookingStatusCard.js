import React from "react";

const BookingStatusCard = ({ booking, onCancel }) => {
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-capitalize">{booking.roomType}</h5>
        <p className="card-text">
          <strong>Check-in:</strong> {formatDate(booking.checkin)} <br />
          <strong>Check-out:</strong> {formatDate(booking.checkout)} <br />
          <strong>Status:</strong>{" "}
          <span
            className={`fw-bold ${
              booking.status === "Pending" ? "text-warning" : "text-success"
            }`}
          >
            {booking.status}
          </span>
          <br />
          {booking.totalPrice && (
            <>
              <strong>Total Price:</strong> ₹{booking.totalPrice}
            </>
          )}
        </p>

        {booking.status === "Pending" && (
          <button
            className="btn btn-danger"
            onClick={() => onCancel(booking._id)}
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingStatusCard;
