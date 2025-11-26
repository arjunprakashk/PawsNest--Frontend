import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import { FaCut, FaHome } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Razorpay SDK loader
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ✅ Price list
const GROOMING_PRICES = {
  "Full Grooming Package": 1500,
  "Basic Bath & Brush": 500,
  "Hair Trimming / Styling": 700,
  "Nail Clipping": 300,
  "Ear Cleaning": 250,
  "Teeth Cleaning": 400,
  "De-shedding Treatment": 600,
  "Flea & Tick Treatment": 800,
  "Paw Care & Conditioning": 350,
  "Spa & Massage": 1200,
};

const PetGroomingPage = () => {
  const [groomingData, setGroomingData] = useState({
    selected_owner_id: "",
    pet_owner_name: "",
    pet_name: "",
    phone: "",
    selectedServices: [],
    appointment_date: "",
    special_requests: "",
  });

  const [owners, setOwners] = useState([]);

  // ✅ Fetch approved owners
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await fetch("https://pawsnest-backend.onrender.com/api/owners/");
        if (!res.ok) throw new Error("Failed to fetch owners");
        const data = await res.json();
        setOwners(data);
      } catch (err) {
        console.error(err);
        toast.error("❌ Error fetching owner list");
      }
    };
    fetchOwners();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === "selectedServices") {
      let updated = [...groomingData.selectedServices];
      if (checked) updated.push(value);
      else updated = updated.filter((s) => s !== value);
      setGroomingData({ ...groomingData, selectedServices: updated });
    } else {
      setGroomingData({ ...groomingData, [name]: value });
    }
  };

  // ✅ Calculate total
  const totalAmount = groomingData.selectedServices.reduce(
    (sum, s) => sum + (GROOMING_PRICES[s] || 0),
    0
  );

  // ✅ Confirm booking
  const confirmBooking = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        toast.warn("⚠️ Please log in first.");
        window.location.href = "/login";
        return;
      }

      const res = await fetch("https://pawsnest-backend.onrender.com/api/grooming-bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          selected_owner_id: groomingData.selected_owner_id,
          pet_owner_name: groomingData.pet_owner_name,
          pet_name: groomingData.pet_name,
          phone: groomingData.phone,
          appointment_date: groomingData.appointment_date,
          special_requests: groomingData.special_requests,
          grooming_services: groomingData.selectedServices.join(", "),
          amount_paid: totalAmount,
        }),
      });

      if (res.status === 401) {
        toast.error("⚠️ Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      if (res.ok) {
        toast.success("🎉 Booking confirmed successfully!");
        setGroomingData({
          selected_owner_id: "",
          pet_owner_name: "",
          pet_name: "",
          phone: "",
          selectedServices: [],
          appointment_date: "",
          special_requests: "",
        });
      } else {
        toast.error("Booking failed: " + JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong while confirming booking.");
    }
  };

  // ✅ Razorpay payment handler
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!groomingData.selected_owner_id)
      return toast.info("Please select a shelter/owner first!");
    if (groomingData.selectedServices.length === 0)
      return toast.info("Please select at least one service!");

    const loaded = await loadRazorpay();
    if (!loaded) return toast.error("Failed to load Razorpay SDK.");

    try {
      const orderRes = await fetch(
        "https://pawsnest-backend.onrender.com/api/create-razorpay-order/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }),
        }
      );

      const orderData = await orderRes.json();
      if (!orderRes.ok)
        throw new Error(orderData.error || "Error creating Razorpay order");

      const { order, key_id } = orderData;

      const options = {
        key: key_id,
        amount: order.amount,
        currency: "INR",
        name: "PawsNest Grooming",
        description: groomingData.selectedServices.join(", "),
        order_id: order.id,
        prefill: {
          name: groomingData.pet_owner_name,
          contact: groomingData.phone,
        },
        handler: function () {
          toast.success("✅ Payment Successful! Confirming booking...");
          confirmBooking();
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      toast.error("❌ Payment initialization failed.");
    }
  };

  // ✅ UI
  return (
    <div className="bg-light">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <section
        className="text-center text-white py-5"
        style={{
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <h2 className="fw-bold animate__animated animate__fadeInDown">
          Pet Grooming Booking
        </h2>
        <p className="lead animate__animated animate__fadeInUp">
          Make your pets look their best! ✂️🐾
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
                <FaCut className="text-primary me-2" /> Book Grooming
              </h4>

              <form onSubmit={handlePayment}>
                {/* Shelter dropdown */}
                <div className="mb-3">
                  <label className="form-label small text-muted">
                    <FaHome className="me-1 text-primary" /> Select Shelter
                  </label>
                  <select
                    name="selected_owner_id"
                    className="form-select rounded-3"
                    value={groomingData.selected_owner_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select a Shelter / Owner --</option>
                    {owners.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.location})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Owner, Pet, Phone */}
                {["pet_owner_name", "pet_name", "phone"].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label small text-muted text-capitalize">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type="text"
                      name={field}
                      className="form-control rounded-3"
                      value={groomingData[field]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}

                {/* Services */}
                <div className="mb-3">
                  <label className="form-label small text-muted">
                    Select Services
                  </label>
                  <div className="d-flex flex-wrap">
                    {Object.keys(GROOMING_PRICES).map((service) => (
                      <div className="form-check me-3 mb-2" key={service}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="selectedServices"
                          value={service}
                          checked={groomingData.selectedServices.includes(service)}
                          onChange={handleChange}
                        />
                        <label className="form-check-label">
                          {service} (₹{GROOMING_PRICES[service]})
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="small text-muted mt-2">
                    Total: ₹{totalAmount}
                  </p>
                </div>

                {/* Appointment date */}
                <div className="mb-3">
                  <label className="form-label small text-muted">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    name="appointment_date"
                    className="form-control rounded-3"
                    value={groomingData.appointment_date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Special requests */}
                <div className="mb-4">
                  <label className="form-label small text-muted">
                    Special Requests
                  </label>
                  <textarea
                    name="special_requests"
                    className="form-control rounded-3"
                    rows="3"
                    value={groomingData.special_requests}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn fw-semibold px-5 py-2 rounded-3"
                    style={{
                      background: "linear-gradient(90deg, #667eea, #764ba2)",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    Pay & Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetGroomingPage;
