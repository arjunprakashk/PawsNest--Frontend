import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUser();
  }, [token, navigate]);

  const fetchUser = async () => {
    try {
      const res = await fetch("https://pawsnest-backend.onrender.com/api/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setUser(data);
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("https://pawsnest-backend.onrender.com/api/auth/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await fetchUser();
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-muted fs-5">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <p className="text-center text-danger mt-5 fw-semibold">{error}</p>
    );

  return (
    <div
      className="d-flex justify-content-center align-items-center py-5 px-3"
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <div
        className="card border-0 shadow-sm p-4 w-100"
        style={{
          maxWidth: "480px",
          borderRadius: "20px",
          background: "#ffffff",
          transition: "all 0.3s ease",
        }}
      >
        {/* Profile Avatar */}
        <div className="text-center mb-4">
          <div
            className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "90px",
              height: "90px",
              background: "#007bff20",
              color: "#007bff",
              fontWeight: "600",
              fontSize: "36px",
              border: "2px solid #007bff30",
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h4 className="fw-bold mt-3 mb-0 text-dark">{user.username}</h4>
          <p className="text-muted small mb-0">{user.email}</p>
        </div>

        <hr />

        {/* Fields */}
        {[
          { label: "Username", name: "username", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Name", name: "name", type: "text" },
          { label: "Location", name: "location", type: "text" },
          { label: "Contact", name: "contact", type: "text" },
        ].map((field, index) => (
          <div className="mb-3" key={index}>
            <label className="form-label fw-semibold small text-secondary mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              className="form-control form-control-sm rounded-3 shadow-sm border-0"
              style={{
                background: editMode ? "#fff" : "#f1f3f5",
                fontSize: "0.95rem",
                transition: "0.3s ease",
              }}
              value={formData[field.name] || ""}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </div>
        ))}

        {editMode && (
          <div className="mb-3">
            <label className="form-label fw-semibold small text-secondary mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Leave blank to keep current password"
              className="form-control form-control-sm rounded-3 shadow-sm border-0"
              style={{ background: "#fff" }}
              value={formData.password || ""}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          {editMode ? (
            <>
              <button
                className="btn btn-success btn-sm px-4 rounded-3 shadow-sm"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-light btn-sm px-4 rounded-3 shadow-sm border"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary btn-sm px-4 rounded-3 shadow-sm"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
          <button
            className="btn btn-outline-danger btn-sm px-4 rounded-3 shadow-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
