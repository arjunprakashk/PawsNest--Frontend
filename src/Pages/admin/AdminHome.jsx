// src/Pages/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000/api";

const AdminHome = () => {
  const [dashboard, setDashboard] = useState({});
  const [pendingOwners, setPendingOwners] = useState([]);
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Dashboard
        const dashRes = await fetch(`${BASE_URL}/admin/dashboard/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dashData = await dashRes.json();
        setDashboard(dashData);

        // Pending Owners
        const pendingRes = await fetch(`${BASE_URL}/admin/pending-owners/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pendingData = await pendingRes.json();
        setPendingOwners(pendingData.owners || pendingData);

        // All Owners
        const ownersRes = await fetch(`${BASE_URL}/admin/owners/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ownersData = await ownersRes.json();
        setOwners(ownersData.owners || ownersData);

        // All Pets
        const petsRes = await fetch(`${BASE_URL}/pets/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const petsData = await petsRes.json();
        setPets(petsData.pets || petsData);

      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Failed to fetch data. Check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token]);

  const approveOwner = async (id) => {
    if (!window.confirm("Approve this owner?")) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/approve-owner/${id}/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPendingOwners(pendingOwners.filter((o) => o.id !== id));
        setOwners([...owners, pendingOwners.find((o) => o.id === id)]);
        alert("Owner approved successfully!");
      } else {
        alert("Failed to approve owner.");
      }
    } catch (err) {
      console.error(err);
      alert("Error approving owner.");
    }
  };

  const deleteOwner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this owner?")) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/delete-owner/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOwners(owners.filter((o) => o.id !== id));
        setPendingOwners(pendingOwners.filter((o) => o.id !== id));
        alert("Owner deleted successfully!");
      } else {
        alert("Failed to delete owner.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting owner.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Dashboard Stats */}
      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Total Users</h5>
            <p className="fw-bold fs-4">{dashboard.totalUsers || 0}</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Total Owners</h5>
            <p className="fw-bold fs-4">{dashboard.totalOwners || 0}</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Total Pets</h5>
            <p className="fw-bold fs-4">{dashboard.totalPets || 0}</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Pending Owners</h5>
            <p className="fw-bold fs-4">{pendingOwners.length}</p>
          </div>
        </div>
      </div>

      {/* Pending Owners */}
      <div className="mb-5">
        <h4>Pending Owners Approval</h4>
        {pendingOwners.length === 0 ? (
          <p>No pending owners.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOwners.map((owner) => (
                  <tr key={owner.id}>
                    <td>{owner.username}</td>
                    <td>{owner.email}</td>
                    <td>{owner.name}</td>
                    <td>{owner.location}</td>
                    <td>{owner.contact}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => approveOwner(owner.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteOwner(owner.id)}
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

      {/* All Owners */}
      <div className="mb-5">
        <h4>All Owners</h4>
        {owners.length === 0 ? (
          <p>No owners found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Approved</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner) => (
                  <tr key={owner.id}>
                    <td>{owner.username}</td>
                    <td>{owner.email}</td>
                    <td>{owner.name}</td>
                    <td>{owner.location}</td>
                    <td>{owner.contact}</td>
                    <td>{owner.is_approved ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteOwner(owner.id)}
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

      {/* All Pets */}
      <div className="mb-5">
        <h4>All Pets</h4>
        {pets.length === 0 ? (
          <p>No pets found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Size</th>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Adopted</th>
                </tr>
              </thead>
              <tbody>
                {pets.map((pet) => (
                  <tr key={pet.id}>
                    <td>{pet.name}</td>
                    <td>{pet.breed}</td>
                    <td>{pet.age}</td>
                    <td>{pet.gender}</td>
                    <td>{pet.size}</td>
                    <td>{pet.owner?.username}</td>
                    <td>{pet.location}</td>
                    <td>{pet.contact}</td>
                    <td>{pet.is_adopted ? "Yes" : "No"}</td>
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

export default AdminHome;
