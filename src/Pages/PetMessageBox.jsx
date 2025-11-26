// PetMessageBox.jsx
import React, { useEffect, useState, useRef } from "react";

const PetMessageBox = ({ petId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("access_token");

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch or create chat room for this pet
  const fetchChatRoom = async () => {
    try {
      const res = await fetch(`https://pawsnest-backend.onrender.com/api/chats/?pet=${petId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch chat room");
      const data = await res.json();

      // If chat exists, get its ID; otherwise, create new chat
      if (data.length > 0) {
        setChatId(data[0].id);
      } else {
        const createRes = await fetch(`https://pawsnest-backend.onrender.com/api/chats/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pet: petId }),
        });

        if (!createRes.ok) throw new Error("Failed to create chat");
        const createData = await createRes.json();
        setChatId(createData.id);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Fetch messages for chat room
  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      const res = await fetch(`https://pawsnest-backend.onrender.com/api/chats/${chatId}/messages/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchChatRoom();
  }, [petId]);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // refresh every 3s
      return () => clearInterval(interval);
    }
  }, [chatId]);

  // Send a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      const res = await fetch(`https://pawsnest-backend.onrender.com/api/chats/${chatId}/send/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="mt-4">
      <h5>💬 Message Owner</h5>
      <div
        className="border rounded p-3 mb-3"
        style={{ height: "250px", overflowY: "scroll", backgroundColor: "#f0f0f0" }}
      >
        {messages.length === 0 && <p className="text-muted">No messages yet. Say hello!</p>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded ${msg.sender_name === username ? "bg-primary text-white text-end" : "bg-light text-start"}`}
          >
            <small>{msg.sender_name}</small>
            <div>{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
};

export default PetMessageBox;
