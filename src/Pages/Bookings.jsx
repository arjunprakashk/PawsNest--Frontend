import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import {
  FaCalendarAlt,
  FaDog,
  FaPhone,
  FaSyringe,
  FaUser,
  FaClipboardCheck,
} from "react-icons/fa";

const BookingsPage = () => {
  const [shelterBookings, setShelterBookings] = useState([]);
  const [vaccinationBookings, setVaccinationBookings] = useState([]);
  const [groomingBookings, setGroomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const [shelterRes, vaccinationRes, groomingRes] = await Promise.all([
          fetch("https://pawsnest-backend.onrender.com/api/shelter-bookings/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://pawsnest-backend.onrender.com/api/vaccination-bookings/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://pawsnest-backend.onrender.com/api/grooming-bookings/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setShelterBookings(await shelterRes.json());
        setVaccinationBookings(await vaccinationRes.json());
        setGroomingBookings(await groomingRes.json());
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3"></div>
        <h5>Loading your bookings...</h5>
      </div>
    );

  const getStatusBadge = (status) => {
    const style =
      status === "approved"
        ? "bg-success"
        : status === "rejected"
        ? "bg-danger"
        : "bg-warning text-dark";
    return (
      <span className={`badge ${style} px-3 py-2 rounded-pill text-capitalize`}>
        {status || "pending"}
      </span>
    );
  };

  const renderBookingCard = (booking, type, icon) => (
    <div className="col-md-4 mb-4" key={`${type}-${booking.id}`}>
      <div
        className="card shadow-lg border-0 animate__animated animate__fadeInUp"
        style={{
          borderRadius: "20px",
          background: "linear-gradient(145deg, #ffffff, #f0f0f8)",
          transition: "all 0.3s ease-in-out",
          cursor: "pointer",
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="d-flex justify-content-center align-items-center rounded-circle me-3"
              style={{
                width: "50px",
                height: "50px",
                background:
                  type === "Shelter"
                    ? "#c7d2fe"
                    : type === "Vaccination"
                    ? "#bbf7d0"
                    : "#fef3c7",
              }}
            >
              {icon}
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-primary">{type} Booking</h5>
              <small className="text-muted">{booking.pet_name || "Unnamed Pet"}</small>
            </div>
          </div>

          <p className="mb-1">
            <FaUser className="text-primary me-2" />
            <strong>Owner:</strong>{" "}
            {booking.owner_name ||
              booking.pet_owner_name ||
              booking.user?.username ||
              booking.ownerName ||
              "N/A"}
          </p>

          <p className="mb-1">
            <FaPhone className="text-primary me-2" />
            <strong>Phone:</strong> {booking.phone || "N/A"}
          </p>

          {type === "Shelter" && (
            <>
              <p className="mb-1">
                <FaCalendarAlt className="text-primary me-2" />
                <strong>Stay:</strong> {booking.start_date} - {booking.end_date}
              </p>
              <p className="text-muted small mb-0">
                <em>Instructions: {booking.special_instructions || "None"}</em>
              </p>
            </>
          )}

          {type === "Vaccination" && (
            <>
              <p className="mb-1">
                <FaCalendarAlt className="text-primary me-2" />
                <strong>Date:</strong> {booking.vaccination_date}
              </p>
              <p className="mb-1">
                <FaSyringe className="text-primary me-2" />
                <strong>Vaccine:</strong> {booking.vaccine_type || "N/A"}
              </p>
              <p className="text-muted small mb-0">
                <em>Notes: {booking.special_notes || "None"}</em>
              </p>
            </>
          )}

          {type === "Grooming" && (
            <>
              <p className="mb-1">
                <FaCalendarAlt className="text-primary me-2" />
                <strong>Appointment:</strong> {booking.appointment_date}
              </p>
              <p className="text-muted small mb-0">
                <em>Notes: {booking.special_notes || "None"}</em>
              </p>
            </>
          )}

          <div className="mt-3 text-end">{getStatusBadge(booking.status)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100">
      {/* Hero Section */}
      <section
        className="text-center text-white py-5 mb-4 shadow-sm"
        style={{
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <h2 className="fw-bold animate__animated animate__fadeInDown display-5">
          My Bookings
        </h2>
        <p className="lead animate__animated animate__fadeInUp">
          Manage all your pet care bookings in one place 🐾
        </p>
      </section>

      <section className="container pb-5">
        <div className="mb-5">
          <h3 className="fw-bold mb-4 text-primary">
            <FaClipboardCheck className="me-2" /> Shelter Bookings
          </h3>
          <div className="row">
            {shelterBookings.length ? (
              shelterBookings.map((b) =>
                renderBookingCard(b, "Shelter", <FaDog size={24} />)
              )
            ) : (
              <p className="text-muted">No shelter bookings yet.</p>
            )}
          </div>
        </div>

        <div className="mb-5">
          <h3 className="fw-bold mb-4 text-success">
            <FaClipboardCheck className="me-2" /> Vaccination Bookings
          </h3>
          <div className="row">
            {vaccinationBookings.length ? (
              vaccinationBookings.map((b) =>
                renderBookingCard(b, "Vaccination", <FaSyringe size={22} />)
              )
            ) : (
              <p className="text-muted">No vaccination bookings yet.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="fw-bold mb-4 text-warning">
            <FaClipboardCheck className="me-2" /> Grooming Bookings
          </h3>
          <div className="row">
            {groomingBookings.length ? (
              groomingBookings.map((b) =>
                renderBookingCard(b, "Grooming", <FaCalendarAlt size={22} />)
              )
            ) : (
              <p className="text-muted">No grooming bookings yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingsPage;
