// OwnerPetListPage.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const OwnerPetListPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/pets/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPets(data); // no filtering here
    } catch (err) {
      console.error("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pet?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/pets/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete pet");
      setPets(pets.filter((p) => p.id !== id));
      alert("Pet deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const getPetImage = (img) =>
    img
      ? img.startsWith("http")
        ? img
        : `http://localhost:8000${img}`
      : "https://via.placeholder.com/300x200?text=No+Image";

  if (loading)
    return <div className="text-center mt-5 fs-5">Loading pets...</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4 fw-bold">My Listed Pets</h2>
      {pets.length === 0 ? (
        <p>No pets added yet.</p>
      ) : (
        <div className="row">
          {pets.map((pet) => (
            <div key={pet.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card shadow-sm h-100" style={{ borderRadius: "15px" }}>
                <img
                  src={getPetImage(pet.image)}
                  className="card-img-top"
                  alt={pet.name}
                  style={{ height: "250px", objectFit: "cover", borderRadius: "15px 15px 0 0" }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{pet.name}</h5>
                  <p><strong>Breed:</strong> {pet.breed}</p>
                  <p><strong>Age:</strong> {pet.age}</p>
                  <p><strong>Size:</strong> {pet.size}</p>
                  <p><strong>Location:</strong> {pet.location}</p>
                </div>
                <div className="card-footer d-flex justify-content-between flex-wrap gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate(`/pets/${pet.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => navigate(`/requests`)}
                  >
                    Requests
                  </button>
                  <button
                     className="btn btn-outline-info"
                      onClick={() => navigate(`/owner/chat`)}
                          >
                             Chat
                      </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(pet.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerPetListPage;
