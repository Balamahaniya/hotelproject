const Booking = require("../models/Booking");
const RoomAvailability = require("../models/RoomAvailability");

const ROOM_PRICES = {
  "2bed-ac": 2000,
  "2bed-non-ac": 1500,
  "4bed-ac": 3000,
  "4bed-non-ac": 2500,
};

// ------------------- CREATE BOOKING -------------------
exports.createBooking = async (req, res) => {
  const { name, email, phone, checkin, checkout, roomType, comments, username } = req.body;

  try {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    const dayDiff = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    if (dayDiff <= 0) {
      return res.status(400).json({ success: false, message: "Checkout must be after check-in date" });
    }

    const totalPrice = ROOM_PRICES[roomType] * dayDiff;

    let isAvailable = true;

    for (let d = new Date(checkinDate); d < checkoutDate; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const availability = await RoomAvailability.findOne({ date, roomType });

      if (!availability || availability.availableRooms <= 0) {
        isAvailable = false;
        break;
      }
    }

    const status = isAvailable ? "Confirmed" : "Pending";

    const newBooking = new Booking({
      username,
      name,
      email,
      phone,
      checkin: checkinDate,
      checkout: checkoutDate,
      roomType,
      comments,
      status,
      totalPrice,
    });

    await newBooking.save();

    if (status === "Confirmed") {
      for (let d = new Date(checkinDate); d < checkoutDate; d.setDate(d.getDate() + 1)) {
        const date = new Date(d);
        await RoomAvailability.findOneAndUpdate(
          { date, roomType },
          { $inc: { availableRooms: -1 } },
          { upsert: true }
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: status === "Confirmed" ? "Booking confirmed" : "Pending approval",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ success: false, message: "Server error during booking" });
  }
};

// ------------------- GET AVAILABILITY -------------------
exports.getAvailability = async (req, res) => {
  const { roomType, checkin, checkout } = req.query;

  if (!roomType || !checkin || !checkout) {
    return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  try {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    let minAvailable = Infinity;

    for (let d = new Date(checkinDate); d < checkoutDate; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const availability = await RoomAvailability.findOne({ date, roomType });
      const available = availability?.availableRooms ?? 0;
      if (available < minAvailable) minAvailable = available;
    }

    res.json({ success: true, remaining: minAvailable });
  } catch (error) {
    console.error("Availability Error:", error);
    res.status(500).json({ success: false, message: "Error checking availability" });
  }
};

// ------------------- GET PENDING BOOKINGS -------------------
exports.getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Pending" }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- GET USER BOOKINGS -------------------
exports.getBookingsByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const bookings = await Booking.find({ username }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Error fetching bookings by user:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- CONFIRM BOOKING (ADMIN) -------------------
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const { checkin, checkout, roomType } = booking;

    // Admin should override even if rooms are full
    for (let d = new Date(checkin); d < checkout; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);

      const existing = await RoomAvailability.findOne({ date, roomType });

      if (existing) {
        // Always reduce availableRooms by 1, even if it's 0 or negative
        await RoomAvailability.findOneAndUpdate(
          { date, roomType },
          { $inc: { availableRooms: -1 } }
        );
      } else {
        // If no record exists, create a new one with -1 (overbooked)
        await RoomAvailability.create({
          date,
          roomType,
          availableRooms: -1,
        });
      }
    }

    booking.status = "Confirmed";
    await booking.save();

    res.json({ success: true, message: "Booking confirmed by admin", booking });
  } catch (error) {
    console.error("Admin confirm error:", error);
    res.status(500).json({ success: false, message: "Error confirming booking" });
  }
};

// ------------------- CANCEL BOOKING -------------------
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Restore availability if booking was confirmed
    if (booking.status === "Confirmed") {
      for (let d = new Date(booking.checkin); d < booking.checkout; d.setDate(d.getDate() + 1)) {
        const date = new Date(d);
        await RoomAvailability.findOneAndUpdate(
          { date, roomType: booking.roomType },
          { $inc: { availableRooms: 1 } },
          { upsert: true }
        );
      }
    }

    res.json({ success: true, message: "Booking cancelled" });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ success: false, message: "Server error during cancellation" });
  }
};
