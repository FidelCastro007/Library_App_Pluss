import React, { useEffect, useState } from "react";
import axios from "./axios"; // Import the custom axios instance
import "../App.css";

function Member() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("/members");
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="member-container">
      <h2 className="member-title">Members</h2>
      <div className="member-list">
        {members.map((member) => (
          <div key={member._id} className="member-card animate-fade-in">
            <h3>{member.name}</h3>
            <p>Email: {member.email}</p>
            <p>Membership: {member.membership}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Member;
