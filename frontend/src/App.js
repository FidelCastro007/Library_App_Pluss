import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Book from "./components/Book";
import Member from "./components/Member";
import Transaction from "./components/Transaction";
import Staff from "./components/Staff";
import Home from "./components/Home"; // Assuming you create a Home component
import Login from "./components/Login";
import Register from "./components/Register";
import Reports from "./components/Reports";
import NavBar from "./components/NavBar"; // Assuming a Navbar component exists for navigation
import Logout from "./components/Logout"; // Import Logout component
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="content">
        <Routes>
          {/* Default route for root */}
          <Route path="/" element={<Home />} />

          {/* Other routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<Book />} />
          <Route path="/members" element={<Member />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/logout" element={<Logout />} /> {/* Logout route */}
          <Route path="/reports" element={<Reports />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
