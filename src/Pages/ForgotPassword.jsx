import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/password-reset/`, { email });
      setMessage(res.data.message || "Password reset link sent to your email.");
    } catch (err) {
      setMessage(
        err.response?.data?.email ||
          err.response?.data?.detail ||
          "Error sending password reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "30px",
      background:
        "linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #eff6ff 100%)",
      fontFamily:
        "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    card: {
      width: "100%",
      maxWidth: "500px", // Increased size from 420 → 500px
      background: "rgba(255,255,255,0.96)",
      borderRadius: "18px",
      padding: "40px 36px", // slightly more padding
      boxShadow: "0 12px 35px rgba(0, 0, 0, 0.1)",
      border: "1px solid rgba(16, 40, 80, 0.06)",
      textAlign: "center",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
    },
    title: {
      fontSize: "26px",
      marginBottom: "10px",
      color: "#0f172a",
      fontWeight: 700,
    },
    subtitle: {
      fontSize: "15px",
      color: "#51627a",
      marginBottom: "28px",
      lineHeight: 1.5,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },
    inputGroup: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 12px",
      borderRadius: "12px",
      border: "1px solid #dbe2f0",
      background: "#fff",
    },
    icon: {
      width: "22px",
      height: "22px",
      stroke: "#6b7280",
      flexShrink: 0,
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: "16px",
      padding: "10px 8px",
      color: "#0b2440",
      background: "transparent",
    },
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      width: "100%",
      padding: "14px 18px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "16px",
      background: "linear-gradient(90deg, #1d4ed8 0%, #2563eb 100%)",
      color: "white",
      boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
      transition: "transform 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease",
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
      boxShadow: "none",
    },
    spinner: {
      display: "inline-block",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.25)",
      borderTopColor: "rgba(255,255,255,1)",
      animation: "spin 0.85s linear infinite",
      marginRight: "8px",
    },
    message: {
      marginTop: "20px",
      fontSize: "14px",
      padding: "12px 14px",
      borderRadius: "10px",
      display: "inline-block",
      wordBreak: "break-word",
    },
    success: {
      color: "#065f46",
      background: "#ecfdf5",
      border: "1px solid rgba(6,95,70,0.08)",
    },
    error: {
      color: "#7f1d1d",
      background: "#fff1f2",
      border: "1px solid rgba(127,29,29,0.06)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password?</h2>
        <p style={styles.subtitle}>
          Enter your registered email address and we’ll send you a password
          reset link.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <svg
              style={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11z" />
              <path d="M4.5 6L12 11l7.5-5" />
            </svg>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    ...styles.spinner,
                    animation: "spin 0.85s linear infinite",
                  }}
                ></span>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              ...(message.toLowerCase().includes("error") ||
              message.toLowerCase().includes("failed")
                ? styles.error
                : styles.success),
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* Inline keyframes and responsiveness */}
      <style>
        {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          div[style*="max-width: 500px"] {
            padding: 22px !important;
            border-radius: 12px !important;
            width: 90% !important;
          }
          h2 { font-size: 20px !important; }
          p { font-size: 13px !important; }
          input { font-size: 14px !important; }
          button { padding: 12px 12px !important; font-size: 14px !important; }
        }
      `}
      </style>
    </div>
  );
};

export default ForgotPassword;
