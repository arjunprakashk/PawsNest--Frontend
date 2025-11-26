import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = "http://localhost:8000/api";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password validation
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (password.length < minLength)
      return "Password must be at least 8 characters long.";
    if (!hasUppercase)
      return "Password must contain at least one uppercase letter.";
    if (!hasLowercase)
      return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecialChar)
      return "Password must contain at least one special character.";
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password always
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: identifier,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save user data
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user_type", data.user_type);
      localStorage.setItem("username", data.username);

      setSuccess("Login successful!");

      setTimeout(() => {
        if (data.user_type === "owner") navigate("/ownerhome");
        else if (data.user_type === "adopter") navigate("/home");
        else if (data.user_type === "admin") navigate("/admin/AdminHome");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-remove alerts
  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  // Animations
  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Poppins', sans-serif",
      background: "#f9fafb",
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
      fontSize: "2.5rem",
      fontWeight: "700",
      textAlign: "center",
      zIndex: 1,
      textShadow: "0 4px 15px rgba(0,0,0,0.4)",
    },
    formSection: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#ffffff",
      padding: "40px",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      background: "rgba(197, 197, 197, 0.95)",
      padding: "45px 35px",
      borderRadius: "20px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
      textAlign: "center",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#1e3a8a",
      marginBottom: "15px",
    },
    subtitle: {
      color: "#475569",
      marginBottom: "25px",
      fontSize: "0.95rem",
    },
    input: {
      width: "100%",
      padding: "14px 18px",
      marginBottom: "15px",
      borderRadius: "12px",
      border: "1px solid #cbd5e1",
      background: "#f8fafc",
      fontSize: "1rem",
      outline: "none",
      transition: "all 0.3s ease",
    },
    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "14px",
      background: "linear-gradient(90deg, #2563eb, #3b82f6)",
      color: "#fff",
      fontWeight: "600",
      fontSize: "1.05rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "10px",
    },
    signup: {
      marginTop: "20px",
      fontSize: "0.9rem",
      color: "#1e293b",
    },
    signupLink: {
      color: "#1d4ed8",
      fontWeight: "600",
      textDecoration: "none",
    },
    forgotLink: {
      display: "block",
      textAlign: "right",
      fontSize: "0.9rem",
      color: "#1d4ed8",
      textDecoration: "none",
      fontWeight: "500",
      marginTop: "-10px",
      marginBottom: "10px",
    },
    alertBox: {
      position: "fixed",
      top: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "14px 25px",
      borderRadius: "14px",
      color: "#fff",
      fontWeight: "500",
      backdropFilter: "blur(12px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      zIndex: 9999,
      maxWidth: "400px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      {/* Alerts */}
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

      {/* Left Image Section */}
      <motion.div
        style={styles.imageSection}
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <div style={styles.overlay}></div>
        <motion.h1
          style={styles.overlayText}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          Welcome to PawsNest 🐾 <br /> Find your furry friend today!
        </motion.h1>
      </motion.div>

      {/* Login Card */}
      <div style={styles.formSection}>
        <motion.div
          style={styles.card}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 style={styles.title} variants={itemVariants}>
            Login
          </motion.h2>
          <motion.p style={styles.subtitle} variants={itemVariants}>
            Access your PawsNest account
          </motion.p>

          <motion.form
            style={{ width: "100%" }}
            onSubmit={handleLogin}
            variants={formVariants}
          >
            <motion.input
              type="email"
              placeholder="Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              style={styles.input}
              variants={itemVariants}
              whileFocus={{ scale: 1.03, boxShadow: "0 0 10px #000000ff" }}
              required
            />

            <motion.input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              variants={itemVariants}
              whileFocus={{ scale: 1.03, boxShadow: "0 0 10px #3b82f6" }}
              required
            />

            {/* Forgot Password */}
            <motion.a
              href="/forgot-password"
              style={styles.forgotLink}
              variants={itemVariants}
              whileHover={{ scale: 1.05, color: "#2563eb" }}
            >
              Forgot Password?
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #3b82f6" }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              style={styles.button}
              disabled={loading}
              variants={itemVariants}
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </motion.form>

          <motion.p style={styles.signup} variants={itemVariants}>
            Don’t have an account?{" "}
            <a href="/signup" style={styles.signupLink}>
              Sign up
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
