import React, { useState } from "react";
import axios from "./axios"; // Import the custom axios instance
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Both email and password are required");
      return;
    }

    try {
      await axios.post("/auth/register", { email, password });
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      setError("Error registering user");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
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
        { /*Register Button */}
        <button class="register-btn">Register</button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Register;
