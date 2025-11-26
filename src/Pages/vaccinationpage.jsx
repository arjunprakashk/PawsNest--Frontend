import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaSyringe, FaDog, FaPhone, FaUser, FaHome, FaClipboardList } from "react-icons/fa";

// ✅ Razorpay script loader
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ✅ Vaccine List
const vaccineList = [
  { name: "Rabies Vaccine", amount: 500 },
  { name: "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)", amount: 700 },
  { name: "Bordetella (Kennel Cough)", amount: 400 },
  { name: "Leptospirosis", amount: 450 },
  { name: "Lyme Disease Vaccine", amount: 600 },
  { name: "Feline Viral Rhinotracheitis", amount: 550 },
  { name: "Feline Leukemia", amount: 650 },
  { name: "Canine Influenza", amount: 500 },
];

const PetVaccinationPage = () => {
  const [owners, setOwners] = useState([]);
  const [vaccinationData, setVaccinationData] = useState({
    selected_owner_id: "",
    ownerName: "",
    petName: "",
    phone: "",
    vaccinationDate: "",
    specialNotes: "",
    selectedVaccines: [],
  });

  // ✅ Fetch Owners
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await fetch("https://pawsnest-backend.onrender.com/api/owners/");
        if (!res.ok) throw new Error("Failed to fetch owners");
        const data = await res.json();
        setOwners(data);
      } catch (err) {
        console.error("Error loading owners:", err);
      }
    };
    fetchOwners();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) =>
    setVaccinationData({ ...vaccinationData, [e.target.name]: e.target.value });

  // ✅ Handle Vaccine Toggle
  const handleVaccineToggle = (vaccine) => {
    const selected = [...vaccinationData.selectedVaccines];
    if (selected.includes(vaccine)) {
      setVaccinationData({
        ...vaccinationData,
        selectedVaccines: selected.filter((v) => v !== vaccine),
      });
    } else {
      setVaccinationData({ ...vaccinationData, selectedVaccines: [...selected, vaccine] });
    }
  };

  // ✅ Calculate Total
  const totalAmount = vaccinationData.selectedVaccines.reduce((sum, v) => {
    const found = vaccineList.find((item) => item.name === v);
    return sum + (found ? found.amount : 0);
  }, 0);

  // ✅ Razorpay + Booking
  const handlePayment = async () => {
    if (!vaccinationData.selected_owner_id || !vaccinationData.ownerName || !vaccinationData.petName) {
      alert("Please fill in all required fields!");
      return;
    }
    if (vaccinationData.selectedVaccines.length === 0) {
      alert("Select at least one vaccine.");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const orderRes = await fetch("https://pawsnest-backend.onrender.com/api/create-razorpay-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const orderData = await orderRes.json();
      if (orderData.error || !orderRes.ok) {
        alert("Error creating payment order: " + JSON.stringify(orderData));
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "PawsNest Vaccination",
        description: "Vaccination Service Booking",
        order_id: orderData.order.id,
        prefill: {
          name: vaccinationData.ownerName,
          contact: vaccinationData.phone,
        },
        theme: { color: "#764ba2" },
        handler: async (response) => {
          try {
            const bookingRes = await fetch("https://pawsnest-backend.onrender.com/api/vaccination-bookings/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: JSON.stringify({
                selected_owner_id: vaccinationData.selected_owner_id,
                pet_owner_name: vaccinationData.ownerName,
                pet_name: vaccinationData.petName,
                phone: vaccinationData.phone,
                vaccination_date: vaccinationData.vaccinationDate,
                special_notes: vaccinationData.specialNotes,
                vaccine_type: vaccinationData.selectedVaccines.join(", "),
                razorpay_payment_id: response.razorpay_payment_id,
              }),
            });

            const bookingData = await bookingRes.json();
            if (bookingRes.ok) {
              alert("✅ Vaccination Booking Confirmed Successfully!");
              setVaccinationData({
                selected_owner_id: "",
                ownerName: "",
                petName: "",
                phone: "",
                vaccinationDate: "",
                specialNotes: "",
                selectedVaccines: [],
              });
            } else {
              alert("Booking failed after payment: " + JSON.stringify(bookingData));
            }
          } catch (err) {
            console.error(err);
            alert("Error creating booking after payment.");
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment cancelled. Booking not confirmed.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="bg-light">
      <section
        className="text-center text-white py-5"
        style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }}
      >
        <h2 className="fw-bold animate__animated animate__fadeInDown">
          Pet Vaccination
        </h2>
        <p className="lead animate__animated animate__fadeInUp">
          Keep your pets safe, strong, and protected 🐾
        </p>
      </section>

      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div
              className="card border-0 shadow-lg p-5 animate__animated animate__fadeInUp"
              style={{ borderRadius: "20px" }}
            >
              <h4 className="fw-bold text-center mb-4">
                <FaSyringe className="text-primary me-2" />
                Schedule a Vaccination
              </h4>

              {/* Owner/Shelter Selection */}
              <div className="mb-3">
                <label className="form-label small text-muted">
                  <FaHome className="me-1 text-primary" /> Select Owner / Shelter
                </label>
                <select
                  name="selected_owner_id"
                  className="form-select rounded-3"
                  value={vaccinationData.selected_owner_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Owner --</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name || owner.username} — ({owner.location})
                    </option>
                  ))}
                </select>
              </div>

              {/* Owner & Pet Details */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label small text-muted">
                    <FaUser className="me-1 text-primary" /> Owner Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    className="form-control rounded-3"
                    value={vaccinationData.ownerName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">
                    <FaDog className="me-1 text-primary" /> Pet Name
                  </label>
                  <input
                    type="text"
                    name="petName"
                    className="form-control rounded-3"
                    value={vaccinationData.petName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label small text-muted">
                  <FaPhone className="me-1 text-primary" /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control rounded-3"
                  value={vaccinationData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Vaccine Selection */}
              <div className="mb-3">
                <label className="form-label small text-muted">
                  <FaClipboardList className="me-1 text-primary" /> Select Vaccines
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {vaccineList.map((vaccine) => {
                    const isSelected = vaccinationData.selectedVaccines.includes(vaccine.name);
                    return (
                      <button
                        type="button"
                        key={vaccine.name}
                        onClick={() => handleVaccineToggle(vaccine.name)}
                        className={`btn ${
                          isSelected ? "btn-primary" : "btn-outline-secondary"
                        } rounded-pill`}
                        style={{
                          minWidth: "180px",
                          textAlign: "center",
                          transition: "0.3s",
                        }}
                      >
                        {vaccine.name} (₹{vaccine.amount})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="mb-3 text-center fw-bold">
                Total Amount: ₹{totalAmount}
              </div>

              {/* Date & Notes */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label small text-muted">
                    Vaccination Date
                  </label>
                  <input
                    type="date"
                    name="vaccinationDate"
                    className="form-control rounded-3"
                    value={vaccinationData.vaccinationDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted">
                    Special Notes
                  </label>
                  <textarea
                    name="specialNotes"
                    className="form-control rounded-3"
                    rows="2"
                    value={vaccinationData.specialNotes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Pay Button */}
              <div className="text-center">
                <button
                  type="button"
                  className="btn fw-semibold px-5 py-2 rounded-3"
                  style={{
                    background: "linear-gradient(90deg, #28a745, #218838)",
                    color: "#fff",
                    border: "none",
                  }}
                  onClick={handlePayment}
                >
                  Pay & Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetVaccinationPage;
