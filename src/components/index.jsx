import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShieldAlt,
  FaUsers,
  FaPaw,
  FaHome,
  FaUserFriends,
  FaHandsHelping,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "animate.css";
import "bootstrap/dist/css/bootstrap.min.css";

const IndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light text-dark">
      {/* ===== NAVBAR ===== */}
      <motion.nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container py-2">
          <a
            className="navbar-brand fw-bold d-flex align-items-center text-primary"
            href="#home"
          >
            <FaPaw className="me-2 text-warning" size={26} />
            PawsNest
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav align-items-lg-center">
              <li className="nav-item mx-2">
                <a
                  className="nav-link fw-semibold"
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("about-section")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  About
                </a>
              </li>

              <li className="nav-item mx-2">
                <a
                  className="nav-link fw-semibold"
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("contact-section")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Contact
                </a>
              </li>

              <li className="nav-item dropdown mx-2">
                <a
                  className="nav-link dropdown-toggle fw-semibold"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </motion.nav>

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className="d-flex flex-column flex-md-row align-items-center justify-content-center text-center text-md-start px-4 px-md-5 vh-100"
        style={{
          background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
          paddingTop: "80px",
        }}
      >
        <motion.div
          className="col-md-6 animate__animated animate__fadeInLeft"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="fw-bold display-4 mb-3 text-dark">
            Welcome to <span className="text-primary">PawsNest 🐾</span>
          </h1>
          <p className="lead text-secondary mb-4">
            A complete digital home for your pets. Manage adoptions, health,
            grooming, and everything your furry family deserves — all in one
            beautiful place.
          </p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <button
              className="btn btn-primary rounded-pill px-4 py-2 me-3 shadow-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="btn btn-outline-dark rounded-pill px-4 py-2"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="col-md-6 mt-5 mt-md-0 text-center"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="https://cdn.pixabay.com/animation/2024/07/19/00/09/00-09-35-674_512.gif"
            alt="Happy Pets"
            className="img-fluid"
            style={{ maxWidth: "820px", borderRadius: "20px" }}
            whileHover={{ scale: 1.05, rotate: 2 }}
          />
        </motion.div>
      </section>

      {/* ===== ABOUT SECTION (MERGED) ===== */}
      <section
        id="about-section"
        className="text-center text-white py-5"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/03/31/19/20/dog-4988985_1280.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <div>
          <h1 className="fw-bold animate__animated animate__fadeInDown">
            About PawsNest
          </h1>
          <p className="lead animate__animated animate__fadeInUp">
            Connecting pets with loving families and promoting a happy, healthy
            life 🐾
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">Our Mission & Vision</h2>
          <p className="text-muted">
            We are dedicated to ensuring every pet finds a loving home and every
            adoption is safe and joyful.
          </p>
        </div>
        <div className="row g-4 text-center">
          {[
            {
              title: "Mission",
              text: "Connecting pets with loving families and promoting responsible adoption.",
            },
            {
              title: "Vision",
              text: "A world where every pet has a safe, happy, and caring home.",
            },
            {
              title: "Values",
              text: "Compassion, dedication, and responsibility in every adoption we facilitate.",
            },
          ].map((item, i) => (
            <div className="col-md-4" key={i}>
              <div className="card border-0 shadow-sm h-100 p-4">
                <h5 className="fw-bold mb-2">{item.title}</h5>
                <p className="text-muted small">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About - Why Choose Us */}
      <section className="py-5 text-center bg-white">
        <div className="container">
          <h3 className="fw-bold mb-4 text-primary">Why Choose PawsNest?</h3>
          <p className="text-muted mb-5">
            We go beyond adoption by providing care, support, and education to
            ensure the happiness and wellbeing of pets and families.
          </p>
          <div className="row g-4">
            <AboutCard
              icon={<FaHeart className="text-primary fs-1 mb-3" />}
              title="Compassionate Care"
              desc="Every pet receives love, attention, and medical care until they find a home."
            />
            <AboutCard
              icon={<FaPaw className="text-primary fs-1 mb-3" />}
              title="Trusted Adoption Process"
              desc="Our thorough adoption process ensures pets go to responsible and loving families."
            />
            <AboutCard
              icon={<FaHome className="text-primary fs-1 mb-3" />}
              title="Safe & Happy Homes"
              desc="We ensure every pet is placed in a secure, caring, and joyful environment."
            />
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section
        id="contact-section"
        className="text-center text-white py-5"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2017/09/25/13/12/dog-2785074_1280.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <div className="container">
          <h1 className="fw-bold display-5 mb-3">Contact Us</h1>
          <p className="lead mb-4">
            Connect with us for suggestions, questions, or pet inquiries 🐾
          </p>

          <div className="row g-4 text-center mt-4">
            <ContactCard icon="📞" title="Call Us" info="+91 949697 7618" />
            <ContactCard
              icon="✉️"
              title="Email Us"
              info="arjunz.project@gmail.com"
            />
            <ContactCard
              icon="📍"
              title="Visit Us"
              info="Malappuram, Kerala, India"
            />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <motion.footer
        className="bg-dark text-white text-center py-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <p className="mb-0 small">
          © {new Date().getFullYear()} PawsNest | Connecting Pets with Families 🐾
        </p>
      </motion.footer>
    </div>
  );
};

/* ===== Reusable Components ===== */
const ContactCard = ({ icon, title, info }) => (
  <div className="col-md-4">
    <motion.div
      className="card border-0 shadow-sm h-100 p-4 text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className="fs-1 mb-3">{icon}</div>
      <h5>{title}</h5>
      <p className="text-muted small">{info}</p>
    </motion.div>
  </div>
);

const AboutCard = ({ icon, title, desc }) => (
  <div className="col-md-4">
    <motion.div
      className="card border-0 shadow-sm p-4 h-100"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {icon}
      <h5>{title}</h5>
      <p className="text-muted small">{desc}</p>
    </motion.div>
  </div>
);

export default IndexPage;
