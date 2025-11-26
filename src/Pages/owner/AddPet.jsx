import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";

const PetAddPage = () => {
  const [petData, setPetData] = useState({
    name: "",
    age: "",
    breed: "",
    gender: "",
    size: "",
    description: "",
    image: null,
    imagePreview: "",
    location: "",
    contact: "", // <-- NEW
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) =>
    setPetData({ ...petData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file)
      setPetData({
        ...petData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!token) {
      alert("You must be logged in to add a pet!");
      setLoading(false);
      return;
    }

    // Token expiration check
    const isTokenExpired = () => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return Date.now() >= payload.exp * 1000;
      } catch {
        return true;
      }
    };

    if (isTokenExpired() && refreshToken) {
      try {
        const res = await fetch("http://localhost:8000/api/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        const data = await res.json();
        if (res.ok && data.access) {
          token = data.access;
          localStorage.setItem("access_token", token);
        } else {
          alert("Session expired. Please log in again.");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
        alert("Failed to refresh token.");
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    for (const key in petData) {
      if (key === "image" && petData.image) formData.append(key, petData.image);
      else formData.append(key, petData[key]);
    }

    try {
      const res = await fetch("http://localhost:8000/api/pets/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Pet "${data.name}" added successfully!`);
        setPetData({
          name: "",
          age: "",
          breed: "",
          gender: "",
          size: "",
          description: "",
          image: null,
          imagePreview: "",
          location: "",
          contact: "",
        });
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong! Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light">
      <section
        className="text-center text-white py-5"
        style={{ background: "linear-gradient(90deg, #007bff, #00bfff)" }}
        data-aos="fade-down"
      >
        <h2 className="fw-bold">Release or Add Your Pet</h2>
        <p className="lead">
          Find loving homes for pets or add them to our community safely.
        </p>
      </section>

      <section
        className="d-flex align-items-center justify-content-center py-5"
        style={{
          fontFamily: "'Poppins', sans-serif",
          backgroundImage: `url('https://images.unsplash.com/photo-1560807707-8cc77767d783')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <div
          className="position-absolute w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", top: 0, left: 0 }}
        ></div>

        <div
          className="card p-5 shadow-lg border-0"
          style={{
            width: "100%",
            maxWidth: "650px",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(15px)",
            color: "#fff",
            zIndex: 2,
          }}
          data-aos="zoom-in"
        >
          <h2 className="text-center mb-4 fw-bold">🐾 Add Your Furry Friend</h2>
          <form onSubmit={handleSubmit}>
            {/* Existing fields */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label text-light small">Pet Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control rounded-3 bg-transparent text-light border-light"
                  placeholder="Enter pet name"
                  value={petData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label text-light small">Breed</label>
                <input
                  type="text"
                  name="breed"
                  className="form-control rounded-3 bg-transparent text-light border-light"
                  placeholder="Breed"
                  value={petData.breed}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label text-light small">Age</label>
                <input
                  type="text"
                  name="age"
                  className="form-control rounded-3 bg-transparent text-light border-light"
                  placeholder="2 years"
                  value={petData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label text-light small">Gender</label>
                <select
                  name="gender"
                  className="form-select rounded-3 bg-transparent text-light border-light"
                  value={petData.gender}
                  onChange={handleChange}
                  required
                  style={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <option value="">Select</option>
                  <option value="Male" style={{ color: "#000" }}>Male</option>
                  <option value="Female" style={{ color: "#000" }}>Female</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label text-light small">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control rounded-3 bg-transparent text-light border-light"
                  placeholder="City, State"
                  value={petData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Size */}
            <div className="mb-3">
              <label className="form-label text-light small">Size</label>
              <select
                name="size"
                className="form-select rounded-3 bg-transparent text-light border-light"
                value={petData.size}
                onChange={handleChange}
                required
                style={{ color: "#fff", backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <option value="">Select</option>
                <option value="Small" style={{ color: "#000" }}>Small</option>
                <option value="Medium" style={{ color: "#000" }}>Medium</option>
                <option value="Large" style={{ color: "#000" }}>Large</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label text-light small">Description</label>
              <textarea
                name="description"
                className="form-control rounded-3 bg-transparent text-light border-light"
                rows="3"
                placeholder="Description"
                value={petData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contact */}
            <div className="mb-3">
              <label className="form-label text-light small">Contact (Phone or Email)</label>
              <input
                type="text"
                name="contact"
                className="form-control rounded-3 bg-transparent text-light border-light"
                placeholder="Enter phone or email"
                value={petData.contact}
                onChange={handleChange}
              />
            </div>

            {/* Image */}
            <div className="mb-3">
              <label className="form-label text-light small">Upload Photo</label>
              <input
                type="file"
                name="image"
                className="form-control rounded-3 bg-transparent text-light border-light"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>

            {petData.imagePreview && (
              <div className="text-center mb-4">
                <img
                  src={petData.imagePreview}
                  alt="Preview"
                  className="img-fluid rounded-4 shadow"
                  style={{ maxWidth: "220px", border: "3px solid white" }}
                />
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="btn fw-semibold px-5 py-2 rounded-pill shadow"
                style={{
                  background: "linear-gradient(90deg, #007bff, #00bfff)",
                  color: "#fff",
                }}
                disabled={loading}
              >
                {loading ? "Adding Pet..." : "Add Pet"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default PetAddPage;
