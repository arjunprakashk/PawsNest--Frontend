// src/pages/AdopterPetListPage.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const AdopterPetListPage = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [breedFilter, setBreedFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/pets/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      const updatedPets = data.map((pet) => {
        const approvedRequest = pet.adoption_requests?.find(
          (req) => req.status === "approved"
        );
        return { ...pet, isAdopted: !!approvedRequest };
      });

      setPets(updatedPets);
      setFilteredPets(updatedPets);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    let temp = [...pets];
    if (searchTerm)
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    if (breedFilter)
      temp = temp.filter(
        (p) => p.breed.toLowerCase() === breedFilter.toLowerCase()
      );
    if (ageFilter)
      temp = temp.filter((p) => p.age.toString() === ageFilter.toString());
    setFilteredPets(temp);
  }, [searchTerm, breedFilter, ageFilter, pets]);

  const getPetImage = (image) =>
    image
      ? image.startsWith("http")
        ? image
        : `http://localhost:8000${image}`
      : "https://via.placeholder.com/300x200?text=No+Image";

  if (loading) return <div className="text-center mt-5">Loading pets...</div>;

  const uniqueBreeds = [...new Set(pets.map((p) => p.breed))];
  const uniqueAges = [...new Set(pets.map((p) => p.age))];

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary fw-bold">Available Pets for Adoption</h2>

      {/* Filters */}
      <div className="row mb-4 g-2">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={breedFilter}
            onChange={(e) => setBreedFilter(e.target.value)}
          >
            <option value="">All Breeds</option>
            {uniqueBreeds.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <option value="">All Ages</option>
            {uniqueAges.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-secondary w-100"
            onClick={() => {
              setSearchTerm("");
              setBreedFilter("");
              setAgeFilter("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Pet Cards */}
      <div className="row">
        {filteredPets.length === 0 ? (
          <p className="text-center">No pets found.</p>
        ) : (
          filteredPets.map((pet) => (
            <div key={pet.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div
                className="card shadow-sm h-100"
                style={{ borderRadius: "15px", cursor: "pointer" }}
                onClick={() => navigate(`/pet/${pet.id}`)}
              >
                <img
                  src={getPetImage(pet.image)}
                  alt={pet.name}
                  className="card-img-top"
                  style={{
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "15px 15px 0 0",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">{pet.name}</h5>
                  <p>
                    <strong>Breed:</strong> {pet.breed}
                  </p>
                  <p>
                    <strong>Age:</strong> {pet.age}
                  </p>
                  {pet.isAdopted ? (
                    <span className="badge bg-secondary">Adopted</span>
                  ) : (
                    <span className="badge bg-success">Available</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdopterPetListPage;
