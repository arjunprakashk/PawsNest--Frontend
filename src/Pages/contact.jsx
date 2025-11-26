import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactPage = () => {
  const token = localStorage.getItem("access_token");
  const userType = localStorage.getItem("user_type");

  return (
    <div>
      {/* Hero Section */}
      <section
        className="text-center text-white py-5"
        style={{
          backgroundImage: "url('https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0,0,0,0.5)"
        }}
      >
        <div>
          <h1 className="fw-bold display-4">Contact & Feedback</h1>
          <p className="lead">Connect with us for suggestions, complaints, or pet inquiries 🐾</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-5 container">
        <div className="row g-4 text-center">
          <ContactCard icon="📞" title="Call Us" info="+91 9496977618" />
          <ContactCard icon="✉️" title="Email Us" info="arjunz.project@gmail.com" />
          <ContactCard icon="📍" title="Visit Us" info="Malappuram, Kerala, India" />
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-5 bg-light">
        <div className="container">
          {userType === "adopter" && <FeedbackForm token={token} />}
          {userType === "adopter" && <AdopterFeedbacks token={token} />}
          {userType === "owner" && <OwnerFeedbacks token={token} />}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        <p className="mb-0 small">© 2025 PawsNest | Connecting Pets with Families 🐾</p>
      </footer>
    </div>
  );
};

// ==================== Contact Card Component ====================
const ContactCard = ({ icon, title, info }) => (
  <div className="col-md-4">
    <div className="card border-0 shadow-sm h-100 p-4 text-center">
      <div className="fs-1 mb-3">{icon}</div>
      <h5>{title}</h5>
      <p className="text-muted small">{info}</p>
    </div>
  </div>
);

// ==================== Feedback Form ====================
const FeedbackForm = ({ token }) => {
  const [type, setType] = useState("feedback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const res = await fetch("https://pawsnest-backend.onrender.com/api/feedbacks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, name, email, message }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback/complaint");

      setSuccess("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
      setType("feedback");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mb-5">
      <h3 className="fw-bold text-primary mb-4">Send Feedback / Complaint</h3>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <input className="form-control" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="col-md-4">
            <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
              <option value="feedback">Feedback</option>
              <option value="complaint">Complaint</option>
            </select>
          </div>
        </div>
        <div className="my-3">
          <textarea className="form-control" rows="4" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} required></textarea>
        </div>
        <button className="btn btn-primary px-4" type="submit">Send</button>
        {success && <p className="text-success mt-2">{success}</p>}
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
};

// ==================== Adopter Feedbacks ====================
const AdopterFeedbacks = ({ token }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const res = await fetch("https://pawsnest-backend.onrender.com/api/feedbacks/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFeedbacks(data.filter(fb => fb.adopter_name === localStorage.getItem("username")));
  };

  return (
    <div>
      <h3 className="fw-bold text-primary mb-3">My Feedbacks</h3>
      {feedbacks.map(fb => (
        <div key={fb.id} className="card mb-3 shadow-sm p-3">
          <strong>{fb.type}</strong>
          <p>{fb.message}</p>
          {fb.reply && <div className="p-2 bg-light rounded"><strong>Owner Reply:</strong> {fb.reply}</div>}
        </div>
      ))}
    </div>
  );
};

// ==================== Owner Feedbacks ====================
const OwnerFeedbacks = ({ token }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  const fetchAllFeedbacks = async () => {
    const res = await fetch("https://pawsnest-backend.onrender.com/api/feedbacks/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setFeedbacks(data);
  };

  const handleReply = async (id, replyText) => {
    await fetch(`https://pawsnest-backend.onrender.com/api/feedbacks/${id}/reply/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reply: replyText }),
    });
    fetchAllFeedbacks();
  };

  return (
    <div>
      <h3 className="fw-bold text-primary mb-3">All Feedbacks</h3>
      {feedbacks.map(fb => (
        <div key={fb.id} className="card mb-3 shadow-sm p-3">
          <strong>{fb.adopter_name} - {fb.type}</strong>
          <p>{fb.message}</p>
          {fb.reply ? (
            <div className="p-2 bg-light rounded"><strong>Reply:</strong> {fb.reply}</div>
          ) : (
            <OwnerReplyForm feedbackId={fb.id} onReply={handleReply} />
          )}
        </div>
      ))}
    </div>
  );
};

const OwnerReplyForm = ({ feedbackId, onReply }) => {
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
        <input type="text" className="form-control" placeholder="Write a reply..." value={reply} onChange={e => setReply(e.target.value)} />
        <button className="btn btn-primary" type="submit">Reply</button>
      </div>
    </form>
  );
};

export default ContactPage;
