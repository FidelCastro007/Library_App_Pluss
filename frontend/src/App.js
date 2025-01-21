import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./components/AuthContext"; // Import AuthContext
import Book from "./components/Book";
import Member from "./components/Member";
import Transaction from "./components/Transaction";
import Staff from "./components/Staff";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Reports from "./components/Reports";
import NavBar from "./components/NavBar";
import Logout from "./components/Logout";
import "./App.css";

function App() {
  const { ProtectedRoute } = useContext(AuthContext); // Access ProtectedRoute from AuthContext

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="content">
          <Routes>
            {/* Default route for root */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/books"
              element={
                <ProtectedRoute>
                  <Book />
                </ProtectedRoute>
              }
            />
            <Route
              path="/members"
              element={
                <ProtectedRoute>
                  <Member />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <Staff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <Logout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
