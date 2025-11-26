import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaPaw, FaHeart, FaHome, FaHandsHelping, FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PetPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section
        className="text-center text-white py-5"
        style={{
          background: "linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%)",
        }}
      >
        <h2 className="fw-bold animate__animated animate__fadeInDown">Adopt a Pet</h2>
        <p className="lead animate__animated animate__fadeInUp">
          Give a loving home to your furry friends today.
        </p>
      </section>

      {/* Main Action Card */}
      <section className="container py-5 text-center">
        <div className="row justify-content-center g-4">
          <div className="col-md-6">
            <div
              className="card border-0 shadow-lg p-5 h-100 animate__animated animate__fadeInUp"
              style={{ borderRadius: "20px", cursor: "pointer", transition: "all 0.3s ease" }}
              onClick={() => navigate("/adopterpetlist")}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
            >
              <FaPaw className="text-primary fs-1 mb-3" />
              <h4 className="fw-bold">Adopt a Pet</h4>
              <p className="text-muted">
                Find your perfect furry companion and give them a loving home today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container py-5 text-center">
        <div className="row align-items-center">
          <div className="col-md-5">
            <img
              src="https://cdn.pixabay.com/photo/2018/10/01/09/21/pets-3715734_1280.jpg"
              alt="Adopt Pet"
              className="img-fluid animate__animated animate__zoomIn"
              style={{ maxHeight: "700px", borderRadius: "35px" }}
            />
          </div>
          <div className="col-md-7">
            <h3 className="fw-bold mb-4">Why Adopt with Us?</h3>
            <div className="row">
              {[
                { icon: <FaHeart />, title: "Compassionate Adoption" },
                { icon: <FaHandsHelping />, title: "Easy Process" },
                { icon: <FaUserFriends />, title: "Trusted Community" },
                { icon: <FaHome />, title: "Safe & Caring Homes" },
              ].map((item, i) => (
                <div key={i} className="col-6 mb-4 animate__animated animate__fadeInUp">
                  <div className="p-3">
                    <div className="text-primary fs-3 mb-2">{item.icon}</div>
                    <h6 className="fw-semibold">{item.title}</h6>
                    <p className="small text-muted">
                      We make it simple, safe, and loving for every pet and pet parent.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        <p className="mb-0 small">© 2025 Paws Nest | Adopt with Love</p>
      </footer>
    </div>
  );
};

export default PetPage;
