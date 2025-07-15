const express = require("express");
const router = express.Router();
const RoomAvailability = require("../models/RoomAvailability");

// Admin sets room availability across a date range
router.post("/set", async (req, res) => {
  const { startDate, endDate, roomType, availableRooms } = req.body;

  if (!startDate || !endDate || !roomType || availableRooms == null) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0); // Normalize

      await RoomAvailability.findOneAndUpdate(
        { date, roomType },
        { availableRooms },
        { new: true, upsert: true }
      );
    }

    res.json({ success: true, message: "Availability updated for all dates" });
  } catch (error) {
    console.error("Set availability error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
