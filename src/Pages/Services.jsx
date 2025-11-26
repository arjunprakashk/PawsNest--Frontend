import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaHome, FaStethoscope, FaBath, FaStar, FaClock, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PetServicesPage = () => {
  const navigate = useNavigate();

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
    { icon: <FaStar />, title: "Expert Staff", desc: "Trained and loving professionals caring for your pets." },
    { icon: <FaClock />, title: "24/7 Care", desc: "Round-the-clock attention to keep pets safe and happy." },
    { icon: <FaShieldAlt />, title: "Safe Environment", desc: "Our facilities are secure and pet-friendly." },
  ];

  const testimonials = [
    { name: "Emily R.", quote: "Amazing service! My dog loved the shelter and grooming care." },
    { name: "James K.", quote: "The vaccination process was smooth, and the staff was very caring." },
  ];

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section
        className="text-center text-white py-5"
        style={{ background: "linear-gradient(90deg, #5bbad5 0%, #6dd5ed 100%)" }}
      >
        <h2 className="fw-bold animate__animated animate__fadeInDown">Our Services</h2>
        <p className="lead animate__animated animate__fadeInUp">
          Caring for your pets like family, every step of the way. Explore our services below!
        </p>
      </section>



      {/* Main Cards */}
      <section className="container py-5">
        <div className="row g-4 justify-content-center">
          {services.map((service, i) => (
            <div key={i} className="col-md-4">
              <div
                className="card text-center border-0 shadow-lg p-4 h-100 animate__animated animate__fadeInUp"
                style={{ borderRadius: "15px", cursor: "pointer", transition: "transform 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-10px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
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
      </section>


      {/* Feature Highlights */}
      <section className="container py-5 text-center">
        <h3 className="fw-bold mb-4 animate__animated animate__fadeInDown">Why Choose Us?</h3>
        <div className="row justify-content-center">
          {features.map((f, i) => (
            <div key={i} className="col-md-4 mb-4 animate__animated animate__fadeInUp">
              <div className="p-3 border rounded shadow-sm">
                <div className="text-success fs-2 mb-2">{f.icon}</div>
                <h5>{f.title}</h5>
                <p className="text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>





      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        <p className="mb-0 small">© 2025 Paws Nest | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default PetServicesPage;
