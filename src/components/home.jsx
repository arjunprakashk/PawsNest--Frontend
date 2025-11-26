import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import "animate.css";
import AOS from "aos";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaStethoscope,
  FaBath,
  FaStar,
  FaClock,
  FaShieldAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "feedback",
    message: "",
  });
  
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true, offset: 100 });
    fetchPets();
    fetchFeedbacks();
  }, []);
            

  const fetchPets = async () => {
    try {
      const res = await fetch("https://pawsnest-backend.onrender.com/api/pets/", {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const updatedPets = data.map((pet) => {
        const approvedRequest = pet.adoption_requests?.find(
          (req) => req.status === "approved"
        );
        return { ...pet, isAdopted: !!approvedRequest };
      });
      setPets(updatedPets);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("https://pawsnest-backend.onrender.com/api/feedbacks/", {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error("Failed to fetch feedbacks:", err);
    }
  };

  const getPetImage = (image) => {
    if (!image) return "https://via.placeholder.com/300x200?text=No+Image";
    return image.startsWith("http") ? image : `https://pawsnest-backend.onrender.com${image}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus({
        success: false,
        message: "You must be logged in to submit feedback.",
      });
      return;
    }
    try {
      const res = await fetch("https://pawsnest-backend.onrender.com/api/feedbacks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit feedback");
      }
      setStatus({ success: true, message: "Thank you! Your feedback has been submitted." });
      setFormData({ name: "", email: "", type: "feedback", message: "" });
      fetchFeedbacks();
    } catch (err) {
      setStatus({ success: false, message: err.message });
    }
  };

  const services = [
    {
      icon: <FaHome />,
      title: "Shelter Booking",
      description: "Book a cozy stay for your pet at our shelter.",
      link: "/shelterbooking",
    },
    {
      icon: <FaStethoscope />,
      title: "Vaccination",
      description: "Ensure your pets are healthy with timely vaccinations.",
      link: "/vaccination",
    },
    {
      icon: <FaBath />,
      title: "Grooming",
      description: "Keep your pets clean, fresh, and happy with grooming services.",
      link: "/grooming",
    },
  ];

  const features = [
    { icon: <FaStar />, title: "Expert Staff", desc: "Trained professionals caring for pets." },
    { icon: <FaClock />, title: "24/7 Care", desc: "Round-the-clock attention for your pets." },
    { icon: <FaShieldAlt />, title: "Safe Environment", desc: "Secure & pet-friendly facilities." },
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#f8f9fa" }}>
      {/* Hero */}
      <div
        className="hero d-flex align-items-center justify-content-center text-center text-light"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560807707-8cc77767d783')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "85vh",
          position: "relative",
        }}
        data-aos="fade-in"
      >
        <div
          className="overlay position-absolute w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        ></div>
        <div className="container position-relative">
          <h1 className="display-4 fw-bold mb-3" data-aos="fade-down" data-aos-delay="300">
            Find Your Perfect Furry Friend 🐕
          </h1>
          <p className="lead mb-4" data-aos="fade-up" data-aos-delay="600">
            Adopt a pet and give them a loving home filled with joy.
          </p>
          <Link
            to="/adopterpetlist"
            className="btn btn-light btn-lg rounded-pill px-5 shadow-sm"
            data-aos="zoom-in"
            data-aos-delay="900"
          >
            Find Your Companion 🐾
          </Link>
        </div>
      </div>

      {/* Available Pets */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold text-primary mb-3">Available Pets</h2>
          <p className="text-muted mb-5">Browse adorable pets waiting for a loving home.</p>

          {loading ? (
            <p className="text-secondary fs-5">Loading pets...</p>
          ) : pets.length === 0 ? (
            <p className="text-muted">No pets available at the moment.</p>
          ) : (
            <div className="row justify-content-center">
              {pets.slice(0, 6).map((pet, i) => (
                <div
                  key={pet.id}
                  className="col-12 col-sm-6 col-lg-4 mb-5 d-flex justify-content-center"
                  data-aos="zoom-in-up"
                  data-aos-delay={i * 100}
                >
                  <div
                    className="card shadow-lg border-0"
                    style={{
                      width: "100%",
                      maxWidth: "340px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    }}
                    onClick={() => navigate(`/pets/${pet.id}`)}
                  >
                    <div
                      style={{
                        backgroundImage: `url(${getPetImage(pet.image)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "260px",
                        width: "100%",
                      }}
                    ></div>
                    <div className="card-body text-center p-4">
                      <h5 className="card-title text-primary fw-bold fs-4 mb-2">{pet.name}</h5>
                      <p className="card-text text-muted mb-3">
                        <strong>Breed:</strong> {pet.breed} <br />
                        <strong>Age:</strong> {pet.age} <br />
                        <strong>Location:</strong> {pet.location || "Not specified"}
                      </p>
                      {pet.isAdopted ? (
                        <button className="btn btn-secondary w-100 rounded-pill fw-semibold shadow-sm" disabled>
                          Adopted ❤️
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary w-100 rounded-pill fw-semibold shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/pets/${pet.id}`);
                          }}
                        >
                          🐾 Adopt Me
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/adopterpetlist" className="btn btn-outline-primary rounded-pill px-4 shadow-sm">
              View All Pets
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="text-center text-white py-5" style={{ background: "linear-gradient(90deg, #5bbad5 0%, #6dd5ed 100%)" }}>
        <h2 className="fw-bold mb-3 animate__animated animate__fadeInDown">Our Services</h2>
        <p className="lead mb-5 animate__animated animate__fadeInUp">Caring for your pets like family.</p>
        <div className="container py-4">
          <div className="row g-4 justify-content-center">
            {services.map((service, i) => (
              <div key={i} className="col-md-4">
                <div
                  className="card text-center border-0 shadow-lg p-4 h-100 hover-scale"
                  style={{ borderRadius: "15px", cursor: "pointer", transition: "transform 0.3s" }}
                  onClick={() => navigate(service.link)}
                >
                  <div className="text-success fs-1 mb-3">{service.icon}</div>
                  <h5 className="fw-bold">{service.title}</h5>
                  <p className="text-muted">{service.description}</p>
                  <button className="btn btn-outline-success mt-2">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback from Adopters */}
      <section className="py-5 container text-center">
        <h2 className="fw-bold mb-4">Feedback from Adopters</h2>
        <p className="text-muted mb-5">Hear from our happy adopters who found their furry friends!</p>
        <div className="row g-4 justify-content-center">
          {feedbacks.length === 0 ? (
            <p className="text-muted">No feedbacks yet. Be the first to share!</p>
          ) : (
            feedbacks.map((fb, i) => (
              <div key={i} className="col-md-4">
                <div className="card shadow-sm border-0 p-4 hover-scale">
                  <p className="text-muted fst-italic">"{fb.message}"</p>
                  <h6 className="fw-bold mt-3">{fb.user_name || "Anonymous"}</h6>
                  {fb.reply && (
                    <p className="text-success mt-2">
                      <strong>Owner Reply:</strong> {fb.reply}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="py-5 bg-white" id="contact">
        <div className="container">
          <h2 className="fw-bold text-center text-primary mb-5">Contact Us</h2>
          <div className="row g-4 text-center mb-5">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <FaPhone className="text-primary fs-1 mb-3" />
                <h5>Call Us</h5>
                <p className="text-muted small">+91 98765 43210</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <FaEnvelope className="text-primary fs-1 mb-3" />
                <h5>Email Us</h5>
                <p className="text-muted small">support@pawsnest.com</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <FaMapMarkerAlt className="text-primary fs-1 mb-3" />
                <h5>Visit Us</h5>
                <p className="text-muted small">123 Pet Street, Mumbai, India</p>
              </div>
            </div>
          </div>

          {status && (
            <div
              className={`alert ${status.success ? "alert-success" : "alert-danger"} text-center`}
            >
              {status.message}
            </div>
          )}

          <form className="mx-auto" style={{ maxWidth: "600px" }} onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold">
                Your Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="type" className="form-label fw-bold">
                Type
              </label>
              <select
                className="form-control"
                id="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="feedback">Feedback</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label fw-bold">
                Message
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary btn-lg px-5">
                Send
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-4 mt-5">
        <p className="mb-0 small">
          © 2025 <strong>PawsNest</strong> | Connecting Pets with Families 🐾
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
