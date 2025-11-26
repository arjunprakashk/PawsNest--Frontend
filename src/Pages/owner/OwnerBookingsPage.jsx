import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaDog,
  FaSyringe,
  FaBath,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const OwnerBookingsPage = () => {
  const [activeTab, setActiveTab] = useState("shelter");
  const [shelterBookings, setShelterBookings] = useState([]);
  const [vaccinationBookings, setVaccinationBookings] = useState([]);
  const [groomingBookings, setGroomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const [shelterRes, vaccinationRes, groomingRes] = await Promise.all([
        fetch("http://localhost:8000/api/shelter-bookings/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/vaccination-bookings/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8000/api/grooming-bookings/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const shelterData = await shelterRes.json();
      const vaccinationData = await vaccinationRes.json();
      const groomingData = await groomingRes.json();

      setShelterBookings(shelterData);
      setVaccinationBookings(vaccinationData);
      setGroomingBookings(groomingData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Error fetching bookings");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle Approve / Reject
  const handleRespond = async (bookingType, bookingId, action) => {
    try {
      const urlMap = {
        shelter: `http://localhost:8000/api/shelter-bookings/${bookingId}/respond/`,
        vaccination: `http://localhost:8000/api/vaccination-bookings/${bookingId}/respond/`,
        grooming: `http://localhost:8000/api/grooming-bookings/${bookingId}/respond/`,
      };

      const response = await fetch(urlMap[bookingType], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }),
      });

      const data = await response.json();
      alert(data.message);
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Error responding to booking");
    }
  };

  // Render individual booking cards
  const renderBookingCard = (booking, type) => (
    <div key={booking.id} className="col-md-6 col-lg-4 mb-4">
      <div className="booking-card p-4 shadow-sm rounded-4 bg-light position-relative">
        <div className="icon-circle">
          {type === "shelter" && <FaDog className="text-primary" />}
          {type === "vaccination" && <FaSyringe className="text-success" />}
          {type === "grooming" && <FaBath className="text-warning" />}
        </div>

        <h5 className="fw-bold mb-2">{booking.pet_name}</h5>
        <p className="mb-1"><strong>Owner:</strong> {booking.owner_name}</p>
        <p className="mb-1"><strong>Phone:</strong> {booking.phone}</p>

        {type === "shelter" && (
          <>
            <p className="mb-1">
              <strong>From:</strong> {booking.start_date} <strong>To:</strong> {booking.end_date}
            </p>
            <p><strong>Instructions:</strong> {booking.special_instructions || "None"}</p>
          </>
        )}

        {type === "vaccination" && (
          <>
            <p className="mb-1"><strong>Vaccine Type:</strong> {booking.vaccine_type}</p>
            <p><strong>Date:</strong> {booking.vaccination_date}</p>
          </>
        )}

        {type === "grooming" && (
          <>
            <p className="mb-1"><strong>Grooming Type:</strong> {booking.grooming_type}</p>
            <p><strong>Appointment:</strong> {booking.appointment_date}</p>
          </>
        )}

        <p className="mt-2"><strong>Status:</strong> <span className="text-capitalize">{booking.status}</span></p>

        {booking.status === "pending" && (
          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-success flex-fill rounded-pill"
              onClick={() => handleRespond(type, booking.id, "approve")}
            >
              <FaCheckCircle className="me-1" /> Approve
            </button>
            <button
              className="btn btn-danger flex-fill rounded-pill"
              onClick={() => handleRespond(type, booking.id, "reject")}
            >
              <FaTimesCircle className="me-1" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Loading
  if (loading)
    return <div className="text-center mt-5 fs-4 fw-bold text-muted">Loading bookings...</div>;

  // Tabs layout
  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold display-6 text-gradient">Owner Bookings Dashboard</h2>
        <p className="text-muted">Manage all your shelter, vaccination and grooming requests</p>
      </div>

      <ul className="nav nav-pills justify-content-center mb-5">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "shelter" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("shelter")}
          >
            <FaDog className="me-2" /> Shelter
          </button>
        </li>
        <li className="nav-item mx-3">
          <button
            className={`nav-link ${activeTab === "vaccination" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("vaccination")}
          >
            <FaSyringe className="me-2" /> Vaccination
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "grooming" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("grooming")}
          >
            <FaBath className="me-2" /> Grooming
          </button>
        </li>
      </ul>

      <div className="row">
        {activeTab === "shelter" && (
          shelterBookings.length
            ? shelterBookings.map((b) => renderBookingCard(b, "shelter"))
            : <p className="text-center">No shelter bookings found.</p>
        )}
        {activeTab === "vaccination" && (
          vaccinationBookings.length
            ? vaccinationBookings.map((b) => renderBookingCard(b, "vaccination"))
            : <p className="text-center">No vaccination bookings found.</p>
        )}
        {activeTab === "grooming" && (
          groomingBookings.length
            ? groomingBookings.map((b) => renderBookingCard(b, "grooming"))
            : <p className="text-center">No grooming bookings found.</p>
        )}
      </div>

      <style>{`
        .text-gradient {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-pills .nav-link {
          border-radius: 50px;
          color: #555;
          font-weight: 600;
          transition: all 0.3s;
        }
        .nav-pills .nav-link:hover {
          background-color: rgba(37, 117, 252, 0.1);
        }
        .active-tab {
          background: linear-gradient(45deg, #6a11cb, #2575fc);
          color: white !important;
        }
        .booking-card {
          background: #fff;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .booking-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        .icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(37, 117, 252, 0.1);
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default OwnerBookingsPage;
