const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const roomRoutes = require("./routes/roomRoutes"); // ✅ New for room availability (admin use)




const app = express();

// ====== Middleware ======
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ====== MongoDB Connection ======
mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb+srv://pro:12345@cluster0.gc0g0vf.mongodb.net/hoteldb")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== Routes ======
app.use("/auth", authRoutes);           // POST /auth/signup , /auth/login
app.use("/booking", bookingRoutes);     // POST /booking/create
app.use("/rooms", roomRoutes);          // ✅ New: For room availability control by admin
app.use("/rooms", roomRoutes);
// ====== Default Route ======
app.get("/", (req, res) => {
  res.send("🏨 Hotel Booking System API is Live");
});

// ====== Start Server ======
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
