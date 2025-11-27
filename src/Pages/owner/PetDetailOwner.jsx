import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";

const BASE_URL = "https://pawsnest-backend.onrender.com/api";

const PetDetailOwner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chat states
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const token = localStorage.getItem("access_token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchPetDetails();
    fetchOrCreateChat();
  }, [id]);

  // Fetch pet details
  const fetchPetDetails = async () => {
    try {
      const res = await fetch(`${BASE_URL}/pets/${id}/`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to load pet details.");
      const data = await res.json();
      setPet(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mark pet as adopted
  const markAsAdopted = async () => {
    try {
      const res = await fetch(`${BASE_URL}/pets/${id}/mark-adopted/`, {
        method: "POST",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to mark as adopted.");
      alert("Pet marked as adopted!");
      fetchPetDetails(); // refresh data
    } catch (err) {
      alert(err.message);
    }
  };

  const getPetImage = (image) => {
    if (!image) return "https://via.placeholder.com/600x400?text=No+Image";
    return image.startsWith("http") ? image : `https://pawsnest-backend.onrender.com${image}`;
  };

  // --- Chat functions ---

  // Fetch or create chat room
  const fetchOrCreateChat = async () => {
    try {
      const res = await fetch(`${BASE_URL}/chatrooms/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ pet_id: id }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setChatRoom(data);
      fetchMessages(data.id);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch messages
  const fetchMessages = async (roomId) => {
    try {
      const res = await fetch(`${BASE_URL}/chatrooms/${roomId}/messages/`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-refresh messages every 2s
  useEffect(() => {
    if (!chatRoom) return;
    const interval = setInterval(() => fetchMessages(chatRoom.id), 2000);
    return () => clearInterval(interval);
  }, [chatRoom]);

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatRoom) return;
    try {
      const res = await fetch(`${BASE_URL}/chatrooms/${chatRoom.id}/messages/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ message: newMessage }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  // --- Render ---
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
            </ul>
            {!pet.is_adopted && (
              <button className="btn btn-warning mt-3" onClick={markAsAdopted}>Mark as Adopted</button>
            )}

            {/* Chat Section */}
            <h5 className="mt-4">Chat with Adopters:</h5>
            <div style={{ minHeight: "200px", border: "1px solid #ccc", padding: "10px", overflowY: "scroll" }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ margin: "5px 0" }}>
                  <b>{msg.sender.username}: </b>{msg.message}
                </div>
              ))}
            </div>
            <div className="mt-2 d-flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="form-control"
              />
              <button className="btn btn-primary ms-2" onClick={sendMessage}>Send</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailOwner;
