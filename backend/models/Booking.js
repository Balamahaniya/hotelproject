const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    checkin: {
      type: Date,
      required: true,
    },
    checkout: {
      type: Date,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      default: "Pending",
    },
    totalPrice: {
      type: Number,
      required: false, // Not required for old records
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
