import React, { useState } from "react";
import axios from "./axios"; // Import the custom axios instance
import { useNavigate } from "react-router-dom";
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token); // Save token to localStorage
      navigate("/"); // Redirect to members page or dashboard
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <form class="form-container" onSubmit={handleLogin}>
      <h2 className="animate__animated animate__bounce text-dark">Login</h2>
      {error && <p>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button class="login-btn" type="submit">Login</button>
        <div className="mt-3 text-center">
          <a href="/register" className="text-decoration-none" style={{ color: '#007bff' }}>
            Don't have an account? Register here
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
