import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "https://pawsnest-backend.onrender.com/api";

const ResetPassword = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${BASE_URL}/password-reset-confirm/`, {
        user_id: userId,
        token: token,
        password: password,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.detail ||
          "Error resetting password. The link may be invalid or expired."
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
      background:
        "linear-gradient(135deg, #e6f0ff 0%, #ffffff 40%, #eaf6ff 100%)",
      padding: "20px",
      fontFamily:
        "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      background: "rgba(255,255,255,0.95)",
      borderRadius: "16px",
      padding: "28px",
      boxShadow: "0 10px 30px rgba(21, 47, 90, 0.09)",
      border: "1px solid rgba(16, 40, 80, 0.05)",
      textAlign: "center",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
    },
    title: {
      fontSize: "22px",
      marginBottom: "8px",
      color: "#112240",
      fontWeight: 700,
    },
    subtitle: {
      fontSize: "14px",
      color: "#51627a",
      marginBottom: "20px",
      lineHeight: 1.4,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    inputGroup: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 10px",
      borderRadius: "10px",
      border: "1px solid #e3e9f5",
      background: "#fff",
    },
    icon: {
      width: "20px",
      height: "20px",
      stroke: "#6b7280",
      flexShrink: 0,
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: "15px",
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
      padding: "12px 14px",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "15px",
      background: "linear-gradient(90deg, #1366d6 0%, #0b7be6 100%)",
      color: "white",
      boxShadow: "0 8px 18px rgba(11, 123, 230, 0.18)",
      transition: "transform 0.14s ease, box-shadow 0.14s ease, opacity 0.14s ease",
    },
    buttonDisabled: {
      opacity: 0.72,
      cursor: "not-allowed",
      boxShadow: "none",
    },
    spinner: {
      display: "inline-block",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.22)",
      borderTopColor: "rgba(255,255,255,0.95)",
      animation: "spin 0.85s linear infinite",
      marginRight: "8px",
    },
    message: {
      marginTop: "16px",
      fontSize: "14px",
      padding: "10px 12px",
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
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Enter your new password below.</p>

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
              <path d="M12 11v2m-6 4V9a6 6 0 1112 0v8m-6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <input
              type="password"
              placeholder="Enter new password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              ...(message.toLowerCase().includes("error") ||
              message.toLowerCase().includes("invalid") ||
              message.toLowerCase().includes("expired")
                ? styles.error
                : styles.success),
            }}
          >
            {message}
          </p>
        )}
      </div>

      {/* Inline spinner keyframe + responsive fix */}
      <style>
        {`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          div[style*="max-width: 420px"] {
            padding: 20px !important;
            border-radius: 12px !important;
          }
          h2 { font-size: 20px !important; }
          p { font-size: 13px !important; }
          input { font-size: 14px !important; }
          button { padding: 11px 12px !important; font-size: 14px !important; }
        }
      `}
      </style>
    </div>
  );
};

export default ResetPassword;
