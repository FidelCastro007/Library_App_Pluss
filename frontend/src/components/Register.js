import React, { useState } from "react";
import axios from "./axios"; // Import the custom axios instance
import { useNavigate } from "react-router-dom";
import 'animate.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [membershipType, setMembershipType] = useState("Basic");
  const [role, setRole] = useState("Member")
  const [staffRole, setStaffRole] = useState(""); // State for staff role
  const [message, setMessage] = useState(""); // State for success message

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Basic validation
  if (!name || !email || !password || !phoneNumber || !role) {
    setError("All required fields must be filled.");
    return;
  }

  if (role === "Member" && !membershipType) {
    setError("Membership type is required for Members.");
    return;
  }

  if (role === "Staff" && !staffRole) {
    setError("Staff role is required for Staff.");
    return;
  }
  
    // Log the data being sent to the backend
    console.log({
      name,
      email,
      password,
      phoneNumber,
      role,
      membershipType,
      staffRole,
    });
  
    try {
      // Send data to backend
      await axios.post("/auth/register", {
        name,
        email,
        password,
        phoneNumber,
        role,
        membershipType: role === "Member" ? membershipType : undefined,
        staffRole: role === "Staff" ? staffRole : undefined,
      });
  
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError("Error registering user.");
    }
  };
  

  return (
    <div className="register-container">
      <form class="form-containers" onSubmit={handleRegister}>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>} {/* Success message */}
      <h2 className="animate__animated animate__bounce text-dark">Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
         />
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
        <input
        type="text"
        placeholder="Phone Number exact 10 digits"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
        {/* Conditional Membership Type */}
        {role === "Member" && (
          <div className="Reg-select-container">
            <select
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Elite">Elite</option>
            </select>
          </div>
        )}

        {/* Conditional Staff Role */}
        {role === "Staff" && (
          <div className="Reg-select-container">
            <select
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
              required
            >
              <option value="">Select Staff Role</option>
              <option value="Librarian">Librarian</option>
              <option value="Assistant">Assistant</option>
            </select>
          </div>
        )}
        <div className="Reg-select-container">
        <select value={role} onChange={(e) => setRole(e.target.value)}  required>
          <option value="">Select Role</option> {/* Default empty option to force user selection */}
          <option value="Member">Member</option>
          <option value="Staff">Staff</option>
        </select>
      </div>
        { /*Register Button */}
        <button className="register-btn">Register</button
        ><div class="mt-1 ms-5 text-center">
          <a href="/login" className="text-decoration-none">
            ← Back to Login
          </a>
        </div>
      </form>
    </div>
  );
}

export default Register;


