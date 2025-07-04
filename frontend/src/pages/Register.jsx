import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/register/`, form);
      alert("✅ Registered successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        const serverErrors = Object.entries(err.response.data)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join("\n");
        alert("❌ Registration failed:\n" + serverErrors);
      } else {
        alert("❌ Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h4 className="mb-0">📝 Register</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                name="username"
                type="text"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
