import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";

const PetDetailAdopter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const res = await fetch(`https://pawsnest-backend.onrender.com/api/pets/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load pet details.");
      const data = await res.json();
      setPet(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendAdoptionRequest = async () => {
    try {
      const res = await fetch(`https://pawsnest-backend.onrender.com/api/adoption-requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pet: id }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to send adoption request.");
      }
      alert("Adoption request sent successfully!");
    } catch (err) {
      alert("Failed to send adoption request: " + err.message);
    }
  };

  const getPetImage = (image) => {
    if (!image) return "https://via.placeholder.com/600x400?text=No+Image";
    return image.startsWith("http") ? image : `https://pawsnest-backend.onrender.com${image}`;
  };

  if (loading) return <p className="text-center mt-5 fs-5">Loading pet details...</p>;
  if (error) return <p className="text-center text-danger mt-5 fs-5">{error}</p>;

  return (
    <div className="container py-5" data-aos="fade-up">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>⬅ Back</button>
      <div className="card shadow-lg border-0 p-4 rounded-4">
        <div className="row g-4">
          <div className="col-md-6">
            <img src={getPetImage(pet.image)} alt={pet.name} className="img-fluid rounded-4 shadow-sm" />
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h2 className="fw-bold text-primary">{pet.name}</h2>
            <p className="text-muted fs-5 mb-3">{pet.description || "No description available."}</p>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item"><strong>Breed:</strong> {pet.breed}</li>
              <li className="list-group-item"><strong>Age:</strong> {pet.age}</li>
              <li className="list-group-item"><strong>Gender:</strong> {pet.gender}</li>
              <li className="list-group-item"><strong>Size:</strong> {pet.size}</li>
              <li className="list-group-item"><strong>Location:</strong> {pet.location}</li>
              <li className="list-group-item"><strong>Contact:</strong> {pet.contact || "Not provided"}</li>
              <li className="list-group-item"><strong>Owner:</strong> {pet.owner_name || pet.owner}</li>
            </ul>
            {!pet.is_adopted && (
              <button className="btn btn-success mt-3" onClick={sendAdoptionRequest}>Request Adoption</button>
            )}
            <button className="btn btn-primary mt-3" onClick={() => navigate(`/chat/${id}`)}>Chat with Owner</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailAdopter;
