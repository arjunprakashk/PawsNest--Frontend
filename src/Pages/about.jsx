import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHeart, FaPaw, FaHome, FaUserFriends, FaHandsHelping } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div style={{ backgroundColor: "#f8f9fa" }}>
      {/* Hero Section */}
      <section 
        className="text-center text-white py-5" 
        style={{
          backgroundImage: "url('https://cdn.pixabay.com/photo/2020/03/31/19/20/dog-4988985_1280.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0,0,0,0.5)"
        }}
      >
        <div>
          <h1 className="fw-bold animate__animated animate__fadeInDown">About PawsNest</h1>
          <p className="lead animate__animated animate__fadeInUp">
            Connecting pets with loving families and promoting a happy, healthy life 🐾
          </p>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-5 container">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-primary">Our Mission & Vision</h2>
          <p className="text-muted">
            We are dedicated to ensuring every pet finds a loving home and every adoption is safe and joyful.
          </p>
        </div>
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 p-4">
              <h5 className="fw-bold mb-2">Mission</h5>
              <p className="text-muted small">
                Connecting pets with loving families and promoting responsible adoption.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 p-4">
              <h5 className="fw-bold mb-2">Vision</h5>
              <p className="text-muted small">
                A world where every pet has a safe, happy, and caring home.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 p-4">
              <h5 className="fw-bold mb-2">Values</h5>
              <p className="text-muted small">
                Compassion, dedication, and responsibility in every adoption we facilitate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 text-center bg-white">
        <div className="container">
          <h3 className="fw-bold mb-4 text-primary">Why Choose PawsNest?</h3>
          <p className="text-muted mb-5">
            We go beyond adoption by providing care, support, and education to ensure the happiness and wellbeing of pets and families.
          </p>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100">
                <FaHeart className="text-primary fs-1 mb-3" />
                <h5>Compassionate Care</h5>
                <p className="text-muted small">
                  Every pet receives love, attention, and medical care until they find a home.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100">
                <FaPaw className="text-primary fs-1 mb-3" />
                <h5>Trusted Adoption Process</h5>
                <p className="text-muted small">
                  Our thorough adoption process ensures pets go to responsible and loving families.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 h-100">
                <FaHome className="text-primary fs-1 mb-3" />
                <h5>Safe & Happy Homes</h5>
                <p className="text-muted small">
                  We ensure every pet is placed in a secure, caring, and joyful environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 text-center">
        <h3 className="fw-bold mb-4 text-primary">Ready to Give a Pet a Forever Home?</h3>
        <a href="/adopterpetlist" className="btn btn-primary btn-lg px-5">Adopt a Pet</a>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        <p className="mb-0 small">© 2025 PawsNest | Connecting Pets with Families 🐾</p>
      </footer>
    </div>
  );
};

export default AboutPage;
