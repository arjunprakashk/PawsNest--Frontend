import React, { useEffect, useState } from "react";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/feedbacks/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setFeedbacks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [token]);

  const handleReply = async (id, replyText) => {
    try {
      const res = await fetch(`http://localhost:8000/api/feedbacks/${id}/reply/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply: replyText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to reply");

      setFeedbacks((prev) =>
        prev.map((fb) => (fb.id === id ? { ...fb, reply: data.reply } : fb))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center my-3">Loading feedbacks...</p>;

  return (
    <div className="container my-5">
      <h2>All Feedbacks</h2>
      {feedbacks.length === 0 && <p>No feedback yet.</p>}

      {feedbacks.map((fb) => (
        <div key={fb.id} className="card p-3 mb-3 shadow-sm">
          <strong>{fb.adopter_name}</strong>{" "}
          <span className="badge bg-secondary">{fb.type}</span>
          <p>{fb.message}</p>
          {fb.reply && (
            <div className="p-2 bg-light rounded">
              <strong>Owner Reply:</strong> {fb.reply}
            </div>
          )}

          {userType === "owner" && !fb.reply && (
            <ReplyForm feedbackId={fb.id} onReply={handleReply} />
          )}

          <small className="text-muted">{new Date(fb.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

const ReplyForm = ({ feedbackId, onReply }) => {
  const [reply, setReply] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reply) return;
    onReply(feedbackId, reply);
    setReply("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Write a reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Reply
        </button>
      </div>
    </form>
  );
};

export default FeedbackList;
