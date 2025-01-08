import React, { useEffect, useState } from "react";
import axios from "./axios"; // Import the custom axios instance

function Staff() {
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("/staff"); // Fetch staff
        setStaff(response.data);
        setMessage("Fetched successfully!");
      } catch (error) {
        setError("Error fetching staff", error);
        setMessage("Book added successfully!");
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="staff-container">
      <h2 className="staff-title">Staff Members</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>} {/* Success message */}
      <ul className="staff-list">
        {staff.map((staff) => (
          <div key={staff._id} className="staff-item animate-fade-in">
            <h3>{staff.name}</h3>
            <p className="animated-p">Email: {staff.email}</p>
            <p className="animated-p">Role: {staff.staffRole}</p>
            <p className="animated-p">Role: {staff.phoneNumber}</p>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Staff;
