import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";

const OwnerHome = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchPets();
    fetchBookings();
  }, []);

  const fetchPets = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/pets/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setPets(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/shelter-bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Dashboard Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">Owner Dashboard</h2>
        <p className="lead">Manage your pets and bookings from here</p>
      </div>

      {/* Quick Action Cards */}
      <div className="row mb-4">
        {/* Add Pet Card */}
        <div className="col-md-4 mb-3">
          <div
            className="card text-center shadow-lg"
            style={{
              height: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(90deg, #007bff, #00bfff)",
              color: "#fff",
              borderRadius: "15px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/addpet")}
          >
            <div>
              <h5 className="fw-bold">Add New Pet</h5>
              <p className="small">Release your furry friend</p>
            </div>
          </div>
        </div>

        {/* Manage Pets Card */}
        <div className="col-md-4 mb-3">
          <div
            className="card text-center shadow-lg"
            style={{
              height: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(90deg, #ff7f50, #ffb347)",
              color: "#fff",
              borderRadius: "15px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/ownerpetlist")}
          >
            <div>
              <h5 className="fw-bold">Manage Pets</h5>
              <p className="small">View or edit your added pets</p>
            </div>
          </div>
        </div>

        {/* Booking History Card */}
        <div className="col-md-4 mb-3">
          <div
            className="card text-center shadow-lg"
            style={{
              height: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(90deg, #28a745, #71dd8a)",
              color: "#fff",
              borderRadius: "15px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/ownerbookings")}
          >
            <div>
              <h5 className="fw-bold">Booking History</h5>
              <p className="small">View your pet bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Added Pets Table */}
      <div className="card shadow-lg p-3 mb-4" data-aos="fade-up">
        <h4 className="fw-bold mb-3">Your Pets</h4>
        {pets.length === 0 ? (
          <p>No pets added yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id}>
                    <td>{pet.name}</td>
                    <td>{pet.breed}</td>
                    <td>{pet.age}</td>
                    <td>{pet.gender}</td>
                    <td>{pet.location}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => navigate(`/pets/${pet.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete ${pet.name}?`
                            )
                          ) {
                            try {
                              const res = await fetch(
                                `http://localhost:8000/api/pets/${pet.id}/`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );
                              if (res.ok) {
                                alert(`${pet.name} deleted successfully!`);
                                fetchPets();
                              } else {
                                alert("Failed to delete pet.");
                              }
                            } catch (err) {
                              console.error(err);
                              alert("Something went wrong!");
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking History Table */}
      <div className="card shadow-lg p-3" data-aos="fade-up">
        <h4 className="fw-bold mb-3">Booking History</h4>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Pet Name</th>
                  <th>Owner Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.pet_name}</td>
                    <td>{booking.owner_name}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone}</td>
                    <td>{booking.start_date}</td>
                    <td>{booking.end_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerHome;
