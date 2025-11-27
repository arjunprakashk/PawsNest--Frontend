// src/pages/EditPetPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [pet, setPet] = useState({
    name: "",
    breed: "",
    age: "",
    size: "Small",
    location: "",
    description: "",
    contact: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPet();
  }, []);

  const fetchPet = async () => {
    try {
      const res = await fetch(`https://pawsnest-backend.onrender.com/api/pets/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch pet details");
      const data = await res.json();
      setPet({
        name: data.name,
        breed: data.breed,
        age: data.age,
        size: data.size,
        location: data.location,
        description: data.description,
        contact: data.contact,
      });
      setLoading(false);
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPet({ ...pet, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(pet).forEach((key) => formData.append(key, pet[key]));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`https://pawsnest-backend.onrender.com/api/pets/${id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error(errData);
        throw new Error("Failed to update pet. Check console for details.");
      }

      alert("Pet updated successfully!");
      navigate("/ownerpetlist");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary fw-bold">Edit Pet</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={pet.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Breed</label>
          <input
            type="text"
            name="breed"
            value={pet.breed}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Age</label>
          <input
            type="text"
            name="age"
            value={pet.age}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Size</label>
          <select
            name="size"
            value={pet.size}
            onChange={handleChange}
            className="form-select"
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Contact</label>
          <input
            type="text"
            name="contact"
            value={pet.contact}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            value={pet.location}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={pet.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Pet Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Update Pet
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPetPage;
