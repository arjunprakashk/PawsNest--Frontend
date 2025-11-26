import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [username, setUsername] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    setFadeIn(true);
    if (token) {
      fetchCurrentUser();
      fetchRequests();
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("https://pawsnest-backend.onrender.com/api/auth/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsername(data.username);
    } catch (err) {
      console.error("Failed to get user info:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("https://pawsnest-backend.onrender.com/api/adoption-requests/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(
        `https://pawsnest-backend.onrender.com/api/adoption-requests/${id}/respond/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );
      if (!res.ok) throw new Error(`Failed to ${action}`);
      const data = await res.json();
      alert(data.message);
      fetchRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "80px",
          fontSize: "18px",
          color: "#4b5563",
        }}
      >
        Loading...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "80px",
          color: "#dc2626",
          fontWeight: "500",
        }}
      >
        {error}
      </div>
    );

  return (
    <div
      className="container py-5"
      style={{
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        maxWidth: "900px",
      }}
    >
      <h2
        style={{
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        Adoption Requests
      </h2>

      {requests.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "15px" }}>
          No adoption requests yet.
        </p>
      )}

      <div className="row">
        {requests.map((req) => (
          <div key={req.id} className="col-md-6 mb-4">
            <div
              className="shadow-sm h-100"
              style={{
                borderRadius: "16px",
                background: "#fff",
                border: "1px solid #e5e7eb",
                padding: "22px",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0,0,0,0.05)";
              }}
            >
              <h5
                style={{
                  color: "#1e3a8a",
                  fontWeight: "700",
                  marginBottom: "12px",
                }}
              >
                {req.pet_name}
              </h5>

              <p style={{ marginBottom: "6px", color: "#374151" }}>
                <strong>Adopter:</strong> {req.adopter}
              </p>

              <p style={{ marginBottom: "6px", color: "#374151" }}>
                <strong>Message:</strong> {req.message || "No message"}
              </p>

              <p style={{ marginBottom: "10px", color: "#374151" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    fontWeight: "600",
                    color:
                      req.status === "pending"
                        ? "#f59e0b"
                        : req.status === "approved"
                        ? "#16a34a"
                        : "#dc2626",
                  }}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </p>

              {req.status === "pending" && req.pet_owner === username && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    className="btn"
                    style={{
                      background: "#16a34a",
                      color: "#fff",
                      fontWeight: "500",
                      borderRadius: "8px",
                      padding: "8px 14px",
                      border: "none",
                      flex: 1,
                      transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#15803d")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#16a34a")
                    }
                    onClick={() => handleAction(req.id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn"
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      fontWeight: "500",
                      borderRadius: "8px",
                      padding: "8px 14px",
                      border: "none",
                      flex: 1,
                      transition: "background 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#b91c1c")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#dc2626")
                    }
                    onClick={() => handleAction(req.id, "reject")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
