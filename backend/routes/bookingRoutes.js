const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingsByUsername,
  getPendingBookings,
  confirmBooking,
  cancelBooking,
  getAvailability, // ✅ Added
} = require("../controllers/bookingController");

// Existing routes
router.post("/create", createBooking);
router.get("/user/:username", getBookingsByUsername);
router.get("/pending", getPendingBookings);
router.put("/confirm/:id", confirmBooking);
router.delete("/cancel/:id", cancelBooking);

// ✅ New route for availability
router.get("/availability", getAvailability);

module.exports = router;
