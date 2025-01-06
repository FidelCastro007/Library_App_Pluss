import React, { useEffect, useState } from "react";
import axios from "./axios"; // Import the custom axios instance

function Staff() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("/staff"); // Fetch staff
        setStaff(response.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    fetchStaff();
  }, []);

  return (
    <div className="staff-container">
      <h2 className="staff-title">Staff Members</h2>
      <ul className="staff-list">
        {staff.map((member) => (
          <li key={member._id} className="staff-item animate-fade-in">
            <h3>{member.name}</h3>
            <p>Email: {member.email}</p>
            <p>Role: {member.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Staff;
