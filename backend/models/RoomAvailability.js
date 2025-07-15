const mongoose = require("mongoose");

const roomAvailabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
  },
  availableRooms: {
    type: Number,
    required: true,
  },
});

roomAvailabilitySchema.index({ date: 1, roomType: 1 }, { unique: true });

module.exports = mongoose.model("RoomAvailability", roomAvailabilitySchema);
