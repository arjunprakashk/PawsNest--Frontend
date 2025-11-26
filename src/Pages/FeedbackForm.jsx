import React, { useState } from "react";

const FeedbackForm = () => {
  const [type, setType] = useState("feedback");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("access_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const res = await fetch("https://pawsnest-backend.onrender.com/api/feedbacks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ type, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit feedback");
      }

      setSuccess("Your feedback has been submitted!");
      setMessage("");
      setType("feedback");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container my-5">
      <h2>Send Feedback / Complaint</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="feedback">Feedback</option>
            <option value="complaint">Complaint</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Send</button>

        {success && <p className="text-success mt-2">{success}</p>}
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default FeedbackForm;
