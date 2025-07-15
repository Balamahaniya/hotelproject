import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/Home"; // ✅ Welcome page
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import BookingForm from "./pages/bookingform";
import Website from "./pages/Website";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

// User protected route
const ProtectedRoute = ({ children }) => {
  const username = localStorage.getItem("username");
  return username ? children : <Navigate to="/login" />;
};

// Admin protected route
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("role") === "admin";
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Welcome Page */}
        <Route path="/" element={<Home />} />

        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/booking" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/website" element={<ProtectedRoute><Website /></ProtectedRoute>} />

        {/* Admin-only Route */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
