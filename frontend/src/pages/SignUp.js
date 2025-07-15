import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import resortImage from "./resort.jpg";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/auth/signup", formData);
      if (res.data.success) {
        setSuccess("User signed up successfully ✅");
        setError("");
        setFormData({ username: "", email: "", password: "" });

        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(res.data.message);
        setSuccess("");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Something went wrong. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${resortImage})` }}>
      <div className="signup-box">
        <h2 className="text-center mb-3">Sign Up</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && <div className="alert alert-success text-center">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            className="form-control my-2"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-control my-2"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="form-control my-2"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-warning w-100 my-3">
            Sign Up
          </button>
        </form>

        <div className="text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#007bff", textDecoration: "underline" }}>
              Login here
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .signup-page {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .signup-box {
          background-color: rgba(255, 255, 255, 0.94);
          padding: 30px;
          border-radius: 12px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .signup-box h2 {
          font-weight: 600;
        }

        .form-control::placeholder {
          color: #888;
        }

        .alert {
          font-size: 14px;
          padding: 10px;
          margin-bottom: 15px;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
