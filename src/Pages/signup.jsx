import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = "https://pawsnest-backend.onrender.com/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user_type, setUserType] = useState("adopter");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(contact)) {
      setError("Contact number must be exactly 10 digits.");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must have 8+ characters, including uppercase, lowercase, number, and special symbol."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          user_type,
          name,
          location,
          contact,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || JSON.stringify(data) || "Signup failed");

      setSuccess(
        user_type === "adopter"
          ? "Signup successful! Please login."
          : "Signup successful! Admin will approve your account soon."
      );

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // 🔽 Reduced visual sizes only — all logic unchanged
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Poppins', sans-serif",
      background: "#f9fafb",
    },
    formSection: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#ffffff",
      padding: "30px", // reduced padding
    },
    card: {
      width: "100%",
      maxWidth: "360px", // reduced from 420px
      background: "rgba(125, 123, 123, 0.95)",
      padding: "22px 18px", // reduced padding
      borderRadius: "16px", // slightly smaller corners
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      textAlign: "center",
    },
    title: {
      fontSize: "1.6rem", // reduced from 2rem
      fontWeight: "700",
      color: "#1e3a8a",
      marginBottom: "15px",
    },
    input: {
      width: "100%",
      padding: "10px 14px", // smaller inputs
      marginBottom: "10px",
      borderRadius: "10px",
      border: "1px solid #cbd5e1",
      background: "#f8fafc",
      fontSize: "0.9rem", // smaller text
      outline: "none",
      transition: "all 0.3s ease",
    },
    button: {
      width: "100%",
      padding: "11px", // smaller button
      border: "none",
      borderRadius: "10px",
      background: "linear-gradient(90deg, #2563eb, #3b82f6)",
      color: "#fff",
      fontWeight: "600",
      fontSize: "0.95rem", // reduced from 1.05rem
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "8px",
    },
    signup: {
      marginTop: "15px",
      fontSize: "0.8rem", // smaller font
      color: "#1e293b",
    },
    signupLink: {
      color: "#1d4ed8",
      fontWeight: "600",
      textDecoration: "none",
    },
    imageSection: {
      flex: 1,
      backgroundImage:
        "url('https://cdn.pixabay.com/photo/2015/11/08/06/37/dog-1033161_1280.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.2)",
      backdropFilter: "blur(1.2px)",
    },
    overlayText: {
      position: "relative",
      color: "white",
      fontSize: "2.1rem", // reduced from 2.5rem
      fontWeight: "700",
      textAlign: "center",
      zIndex: 1,
      textShadow: "0 4px 15px rgba(0,0,0,0.4)",
    },
    alertBox: {
      position: "fixed",
      top: "25px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 20px",
      borderRadius: "10px",
      color: "#fff",
      fontWeight: "500",
      backdropFilter: "blur(10px)",
      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      zIndex: 9999,
      maxWidth: "340px",
      textAlign: "center",
      fontSize: "0.9rem",
    },
  };

  return (
    <div style={styles.container}>
      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ ...styles.alertBox, background: "rgba(239,68,68,0.9)" }}
          >
            ❌ {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            style={{ ...styles.alertBox, background: "rgba(16,185,129,0.9)" }}
          >
            ✅ {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form on Left */}
      <div style={styles.formSection}>
        <motion.div
          style={styles.card}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 style={styles.title} variants={itemVariants}>
            Create Account
          </motion.h2>

          <form style={{ width: "100%" }} onSubmit={handleSignup}>
            <motion.input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              variants={itemVariants}
              required
            />
            <motion.input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              variants={itemVariants}
              required
            />
            <motion.input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              variants={itemVariants}
              required
            />
            <motion.input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              variants={itemVariants}
              required
            />
            <motion.input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
              variants={itemVariants}
              required
            />
            <motion.input
              type="text"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              style={styles.input}
              variants={itemVariants}
              required
            />
            <motion.select
              value={user_type}
              onChange={(e) => setUserType(e.target.value)}
              style={styles.input}
              variants={itemVariants}
            >
              <option value="adopter">Adopter</option>
              <option value="owner">Owner/Shelter</option>
            </motion.select>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 12px #3b82f6" }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              style={styles.button}
              disabled={loading}
              variants={itemVariants}
            >
              {loading ? "Signing up..." : "Signup"}
            </motion.button>
          </form>

          <motion.p style={styles.signup} variants={itemVariants}>
            Already have an account?{" "}
            <a href="/login" style={styles.signupLink}>
              Login
            </a>
          </motion.p>
        </motion.div>
      </div>

      {/* Image on Right */}
      <div style={styles.imageSection}>
        <div style={styles.overlay}></div>
        <motion.h1
          style={styles.overlayText}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          Join PawsNest 🐾 <br /> Find your furry friend today!
        </motion.h1>
      </div>
    </div>
  );
};

export default Signup;
