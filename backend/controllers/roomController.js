const RoomAvailability = require("../models/RoomAvailability");

// Admin: Set availability for room type in a date range
exports.setRoomAvailability = async (req, res) => {
  const { startDate, endDate, roomType, availableRooms } = req.body;

  if (!startDate || !endDate || !roomType || availableRooms == null) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0); // Normalize date

      await RoomAvailability.findOneAndUpdate(
        { date, roomType },
        { $set: { availableRooms } },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: "Availability set successfully" });
  } catch (err) {
    console.error("Availability Set Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
