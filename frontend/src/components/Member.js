import React, { useEffect, useState } from "react";
import axios from "./axios"; // Import the custom axios instance
import "../App.css";

function Member() {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("/members");
        setMembers(response.data);
        setMessage("Fetched successfully!");
      } catch (error) {
        setError("Error fetching members", error);
        setMessage("");
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="member-container">
      <h2 className="member-title">Members</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>} {/* Success message */}
      <div className="member-list">
        {members.map((member) => (
          <div key={member._id} className="member-card animate-fade-in">
            <h3>{member.name}</h3>
            <p className="animated-p">Email: {member.email}</p>
            <p className="animated-p">Membership: {member.membershipType}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Member;
