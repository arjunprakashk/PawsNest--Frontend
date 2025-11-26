// src/Pages/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Add welcome message when chat opens
  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Hi there! I'm PawsNest Assistant. How can I help you today?",
      },
    ]);
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(
        `https://pawsnest-backend.onrender.com/api/chatbot/?message=${encodeURIComponent(input)}`
      );
      const data = await res.json();

      if (data.pets && Array.isArray(data.pets)) {
        const botMsg = { sender: "bot", text: data.reply, pets: data.pets };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const botMsg = { sender: "bot", text: data.reply };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      const botMsg = {
        sender: "bot",
        text: "⚠️ Connection error. Try again later.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // 🐾 Pet card display
  const PetCard = ({ pet }) => {
    const imgUrl = pet.image
      ? pet.image.startsWith("http")
        ? pet.image
        : `https://pawsnest-backend.onrender.com${pet.image}`
      : "https://via.placeholder.com/200x150?text=No+Image";

    return (
      <div style={cardStyles.card}>
        <img src={imgUrl} alt={pet.name} style={cardStyles.image} />
        <div style={cardStyles.info}>
          <strong>{pet.name}</strong>
          <p style={{ margin: "4px 0" }}>{pet.breed}</p>
          <p style={{ fontSize: "13px", color: "#666" }}>
            {pet.gender} • {pet.age}
          </p>
          <p style={{ fontSize: "13px", color: "#888" }}>{pet.location}</p>
          <div style={cardStyles.actions}>
            <button
              style={cardStyles.viewBtn}
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              View
            </button>
            <button
              style={cardStyles.adoptBtn}
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              💖 Adopt
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Messages */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={msg.sender === "user" ? styles.userMsg : styles.botMsg}
          >
            {msg.text}
            {msg.pets && (
              <div style={styles.petCardContainer}>
                {msg.pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={styles.botMsg}>
            <span className="typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div style={styles.inputBox}>
        <input
          type="text"
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about pets..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>

      {/* Typing Animation */}
      <style>
        {`
          .typing {
            display: inline-flex;
            gap: 4px;
          }
          .dot {
            width: 6px;
            height: 6px;
            background: #555;
            border-radius: 50%;
            animation: blink 1.4s infinite both;
          }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes blink { 0%,80%,100%{opacity:0;} 40%{opacity:1;} }
        `}
      </style>
    </div>
  );
};

// ✅ Updated styles
const styles = {
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    background: "white",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  chatBox: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  userMsg: {
    alignSelf: "flex-end",
    background: "#dcf8c6",
    padding: "10px 14px",
    borderRadius: "12px",
    maxWidth: "80%",
    fontSize: "14px",
  },
  botMsg: {
    alignSelf: "flex-start",
    background: "#f1f0f0",
    padding: "10px 14px",
    borderRadius: "12px",
    maxWidth: "90%",
    fontSize: "14px",
  },
  petCardContainer: {
    display: "flex",
    gap: "10px",
    overflowX: "auto",
    marginTop: "8px",
  },
  inputBox: {
    display: "flex",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "10px",
  },
  button: {
    border: "none",
    background: "#007bff",
    color: "white",
    padding: "10px 15px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

// ✅ Card styles
const cardStyles = {
  card: {
    minWidth: "160px",
    maxWidth: "180px",
    border: "1px solid #eee",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    flex: "0 0 auto",
  },
  image: {
    width: "100%",
    height: "100px",
    objectFit: "cover",
  },
  info: {
    padding: "8px",
    textAlign: "left",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "6px",
  },
  viewBtn: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "4px 8px",
    fontSize: "12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  adoptBtn: {
    background: "#28a745",
    color: "white",
    border: "none",
    padding: "4px 8px",
    fontSize: "12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ChatBot;
