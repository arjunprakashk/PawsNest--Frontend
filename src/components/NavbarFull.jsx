// src/Components/NavbarFull.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaBell, FaUserCircle, FaSignOutAlt, FaPaw } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { logoutUser } from "../utils/authUtils";
import "animate.css";

const NavbarFull = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const username = localStorage.getItem("username");
  const userType = localStorage.getItem("user_type"); // 👈 new line

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/notifications/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleLogout = () => {
    logoutUser(navigate);
    toast.success("Logged out successfully!");
  };

  // 👇 Different menu items based on user type
  let navLinks = [];

  if (userType === "owner") {
    navLinks = [
      
      ["My Pets", "/ownerpetlist"],
      ["Add Pet", "/addpet"],
      ["Requests", "/requests"],
      ["Bookings", "/ownerbookings"],
      ["Feedbacks", "/feedbacks"],
      
    ];
  } else if (userType === "adopter") {
    navLinks = [
      
      ["Browse Pets", "/petpage"],
      ["My Requests", "/requests"],
      ["Bookings", "/bookings"],
      ["Services", "/services"],
      ["About", "/about"],
      ["Contact", "/contact"],
    ];
  } else {
    // default for guests
    navLinks = [
      ["Home", "/"],
      ["About", "/about"],
      ["Contact", "/contact"],
    ];
  }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-lg sticky-top"
      style={{
        background: "linear-gradient(90deg, #5e60ce, #64dfdf)",
        transition: "0.3s ease-in-out",
      }}
    >
      <div className="container">
        {/* Logo */}
        <NavLink
          className="navbar-brand fw-bold fs-3 d-flex align-items-center"
          to={userType === "owner" ? "/ownerhome" : "/home"}
        >
          <FaPaw className="me-2" /> PawsNest
        </NavLink>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <IoMenu size={28} color="#fff" />
        </button>

        {/* Nav Links */}
        <div
          className={`collapse navbar-collapse justify-content-end ${
            isMenuOpen ? "show animate__animated animate__fadeInDown" : ""
          }`}
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            {navLinks.map(([label, path]) => (
              <li className="nav-item mx-1" key={path}>
                <NavLink
                  to={path}
                  className="nav-link fw-semibold"
                  style={{ color: "#fff", transition: "0.3s" }}
                >
                  {label}
                </NavLink>
              </li>
            ))}

            {/* Notification Bell */}
            {token && (
              <li className="nav-item position-relative mx-2">
                <FaBell
                  size={22}
                  className="text-light"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {notifications.length > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {notifications.length}
                  </span>
                )}

                {showDropdown && (
                  <div
                    className="dropdown-menu dropdown-menu-end show shadow-lg animate__animated animate__fadeIn"
                    style={{
                      minWidth: "270px",
                      right: 0,
                      borderRadius: "10px",
                    }}
                  >
                    <h6 className="dropdown-header text-center fw-bold text-primary">
                      Notifications
                    </h6>
                    <div className="dropdown-divider"></div>
                    {notifications.length === 0 ? (
                      <span className="dropdown-item text-muted text-center">
                        No new notifications
                      </span>
                    ) : (
                      notifications.map((n) => (
                        <span
                          key={n.id}
                          className="dropdown-item small text-dark"
                          style={{
                            borderBottom: "1px solid #eee",
                            whiteSpace: "normal",
                          }}
                        >
                          {n.message}
                        </span>
                      ))
                    )}
                  </div>
                )}
              </li>
            )}

            {/* Profile Avatar */}
            {token && (
              <li className="nav-item position-relative mx-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${username}&background=5e60ce&color=fff&size=36`}
                  alt="profile"
                  className="rounded-circle border border-light"
                  style={{ cursor: "pointer", width: "36px", height: "36px" }}
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                />

                {showProfileDropdown && (
                  <div
                    className="dropdown-menu dropdown-menu-end show shadow-lg animate__animated animate__fadeIn"
                    style={{
                      minWidth: "200px",
                      right: 0,
                      borderRadius: "10px",
                    }}
                  >
                    <span className="dropdown-item text-primary fw-bold text-center">
                      {username}
                    </span>
                    <div className="dropdown-divider"></div>
                    <span
                      className="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/profile")}
                    >
                      <FaUserCircle className="me-2 text-secondary" />
                      Profile
                    </span>
                    <span
                      className="dropdown-item text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </span>
                  </div>
                )}
              </li>
            )}

            {/* Conditional Login / Signup */}
            {!token && (
              <>
                <li className="nav-item mx-1">
                  <NavLink
                    to="/login"
                    className="nav-link fw-semibold text-light"
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item mx-1">
                  <NavLink
                    to="/signup"
                    className="nav-link fw-semibold text-light"
                  >
                    Signup
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarFull;
