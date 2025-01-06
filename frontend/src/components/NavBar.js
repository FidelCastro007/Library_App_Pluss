import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function NavBar() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <nav>
      <ul className="navbar" style={{ textDecoration: "none",listStyleType: "none" }}>

        {isLoggedIn ? (
          <>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/books">Books</Link></li>
          <li><Link to="/members">Members</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/staff">Staff</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/logout">Logout</Link></li> {/* Logout link */}
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
