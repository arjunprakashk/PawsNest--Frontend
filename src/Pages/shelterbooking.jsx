import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import {
  FaCalendarCheck,
  FaDog,
  FaPhone,
  FaPaw,
  FaUser,
} from "react-icons/fa";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const ShelterBookingPage = () => {
  const [bookingData, setBookingData] = useState({
    ownerName: "",
    petName: "",
    phone: "",
    startDate: "",
    endDate: "",
    specialInstructions: "",
    selectedOwnerId: "",
  });

  const [owners, setOwners] = useState([]);

  // 🟩 Fetch owners list for dropdown
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch("https://pawsnest-backend.onrender.com/api/owners/");
        if (!response.ok) throw new Error("Failed to fetch owner list");
        const data = await response.json();
        setOwners(data);
      } catch (error) {
        console.error("Error fetching owners:", error);
        Swal.fire("Error", "Failed to load owners list", "error");
      }
    };
    fetchOwners();
  }, []);

  const handleChange = (e) =>
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });

  // 🧮 Calculate stay duration
  const getNumberOfDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const dayRate = 300;
  const numberOfDays = getNumberOfDays(
    bookingData.startDate,
    bookingData.endDate
  );
  const totalAmount = numberOfDays * dayRate;

  // 🟩 Submit booking after successful payment
  const submitBooking = async () => {
    try {
      const response = await fetch("https://pawsnest-backend.onrender.com/api/shelter-bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          owner_name: bookingData.ownerName,
          pet_name: bookingData.petName,
          phone: bookingData.phone,
          start_date: bookingData.startDate,
          end_date: bookingData.endDate,
          special_instructions: bookingData.specialInstructions,
          selected_owner_id: bookingData.selectedOwnerId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Booking Confirmed 🎉",
          text: "Your shelter booking has been successfully confirmed!",
          confirmButtonColor: "#28a745",
        });
        setBookingData({
          ownerName: "",
          petName: "",
          phone: "",
          startDate: "",
          endDate: "",
          specialInstructions: "",
          selectedOwnerId: "",
        });
      } else {
        Swal.fire("Booking Failed", JSON.stringify(data), "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "An error occurred while confirming booking.", "error");
    }
  };

  // 🟩 Razorpay Payment
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      Swal.fire("Error", "Razorpay SDK failed to load.", "error");
      return;
    }

    try {
      const orderRes = await fetch("https://pawsnest-backend.onrender.com/api/create-razorpay-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
          receipt: `Shelter-${bookingData.petName}`,
          notes: { owner: bookingData.ownerName },
        }),
      });

      const orderData = await orderRes.json();
      if (orderData.error) {
        Swal.fire("Error", "Error creating payment order: " + orderData.error, "error");
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "PawsNest Booking",
        description: `Shelter Booking for ${numberOfDays} night(s)`,
        order_id: orderData.order.id,
        prefill: {
          name: bookingData.ownerName,
          contact: bookingData.phone,
        },
        handler: function (response) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful 💳",
            text: `Transaction ID: ${response.razorpay_payment_id}`,
            confirmButtonColor: "#28a745",
          }).then(() => submitBooking());
        },
        theme: { color: "#667eea" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Payment failed. Try again.", "error");
    }
  };

  return (
    <div className="bg-light">
      <section
        className="text-center text-white py-5"
        style={{ background: "linear-gradient(90deg, #667eea, #764ba2)" }}
      >
        <h2 className="fw-bold animate__animated animate__fadeInDown">
          Shelter Booking
        </h2>
        <p className="lead animate__animated animate__fadeInUp">
          Book a safe and loving stay for your furry friend 🐾
        </p>
      </section>

      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card border-0 shadow-lg p-5 animate__animated animate__fadeInUp">
              <h4 className="fw-bold text-center mb-4">
                <FaCalendarCheck className="text-primary me-2" />
                Book Your Pet’s Stay
              </h4>

              {/* Form Inputs */}
              <div className="mb-4">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label small text-muted">
                      <FaUser className="me-1 text-primary" /> Select Owner
                    </label>
                    <select
                      name="selectedOwnerId"
                      className="form-control rounded-3"
                      value={bookingData.selectedOwnerId}
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
                  <div className="col-md-6">
                    <label className="form-label small text-muted">
                      <FaPaw className="me-1 text-primary" /> Owner Name
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      className="form-control rounded-3"
                      placeholder="Your Name"
                      value={bookingData.ownerName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label small text-muted">
                      <FaDog className="me-1 text-primary" /> Pet Name
                    </label>
                    <input
                      type="text"
                      name="petName"
                      className="form-control rounded-3"
                      placeholder="Your Pet's Name"
                      value={bookingData.petName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">
                      <FaPhone className="me-1 text-primary" /> Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control rounded-3"
                      placeholder="Phone Number"
                      value={bookingData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label small text-muted">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      className="form-control rounded-3"
                      value={bookingData.startDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      className="form-control rounded-3"
                      value={bookingData.endDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small text-muted">
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    className="form-control rounded-3"
                    rows="3"
                    placeholder="Feeding, medication, etc."
                    value={bookingData.specialInstructions}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* Booking Summary */}
              <div
                className="mb-4 p-3 rounded-3 shadow-sm text-center"
                style={{ background: "#f8f9fa" }}
              >
                <h5 className="fw-bold mb-2">Booking Summary</h5>
                <p className="mb-1">
                  Number of nights: <strong>{numberOfDays}</strong>
                </p>
                <p className="mb-0">
                  Total Amount: <strong>₹{totalAmount}</strong>
                </p>
              </div>

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

export default ShelterBookingPage;
