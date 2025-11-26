import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = "https://pawsnest-backend.onrender.com/api";

const ChatPage = () => {
  const { petId } = useParams();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("access_token");
  const requestUserId = parseInt(localStorage.getItem("user_id"));

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Create/fetch chat room
  const fetchOrCreateChat = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/chatrooms/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ pet: parseInt(petId, 10) }),
      });
      if (!res.ok) throw new Error("Failed to create/fetch chat room");
      const data = await res.json();
      setChatId(data.id);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      const res = await fetch(`${BASE_URL}/chatrooms/${chatId}/messages/`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;
    try {
      const res = await fetch(`${BASE_URL}/chatrooms/${chatId}/messages/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ message: newMessage }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (petId) fetchOrCreateChat();
  }, [petId]);

  useEffect(() => {
    if (!chatId) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  if (!petId) return <div>Invalid pet ID</div>;

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "15px" }}>Chat for Pet ID: {petId}</h2>

      <div
        style={{
          minHeight: "400px",
          maxHeight: "60vh",
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg) => {
          const isOwner = msg.sender?.id === requestUserId;
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isOwner ? "flex-end" : "flex-start",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "6px 10px",
                  borderRadius: "12px",
                  backgroundColor: isOwner ? "#007bff" : "#fff",
                  color: isOwner ? "#fff" : "#000",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  wordBreak: "break-word",
                  fontSize: "0.9rem",
                }}
              >
                {!isOwner && <div style={{ fontWeight: "bold", fontSize: "0.75rem", marginBottom: "2px" }}>{msg.sender?.username}</div>}
                <div>{msg.message}</div>
                <div style={{ textAlign: "right", fontSize: "0.7rem", color: isOwner ? "#e0e0e0" : "#555", marginTop: "2px" }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "0.9rem",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "6px",
            padding: "0 15px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
