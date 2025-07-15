import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import resortImage from "./resort.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("https://hotelproject-rrz7.onrender.com/auth/login", {
        username,
        password,
      });

      if (res.status === 200 && res.data.success) {
        const { role } = res.data.user;

        alert("Login Successful");

        localStorage.setItem("username", username);
        localStorage.setItem("role", role);

        // Redirect based on actual role from backend
        navigate(role === "admin" ? "/admin" : "/website");
      } else {
        alert("Login Failed: " + res.data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${resortImage})` }}
    >
      <div className="login-box">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control my-3"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control my-3"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-warning w-100">
            Submit
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-box {
          background-color: rgba(255, 255, 255, 0.92);
          padding: 30px;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .form-control::placeholder {
          color: #888;
        }
      `}</style>
    </div>
  );
};

export default Login;
