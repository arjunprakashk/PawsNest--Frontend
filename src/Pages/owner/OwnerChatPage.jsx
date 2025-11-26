// OwnerChatPage.jsx
import React, { useEffect, useState, useRef } from "react";

const OwnerChatPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("access_token");
  const requestUserId = parseInt(localStorage.getItem("user_id"));

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/chatrooms/", { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to fetch chat rooms");
      const data = await res.json();
      setChatRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/chatrooms/${roomId}/messages/`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    fetchMessages(room.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;
    try {
      const res = await fetch(`http://localhost:8000/api/chatrooms/${selectedRoom.id}/messages/`, {
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

  useEffect(() => {
    if (!selectedRoom) return;
    fetchMessages(selectedRoom.id);
    const interval = setInterval(() => fetchMessages(selectedRoom.id), 2000);
    return () => clearInterval(interval);
  }, [selectedRoom]);

  // Group consecutive messages
  const groupedMessages = [];
  messages.forEach((msg) => {
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.senderId === msg.sender.id) {
      lastGroup.messages.push(msg);
    } else {
      groupedMessages.push({ senderId: msg.sender.id, senderName: msg.sender.username, messages: [msg] });
    }
  });

  return (
    <div className="container-fluid mt-3">
      <h2 className="text-primary fw-bold mb-3 text-center" style={{ fontSize: "1.5rem" }}>Adopter Chats</h2>
      <div className="row g-2" style={{ height: "75vh" }}>
        {/* Chat List */}
        <div className="col-12 col-md-4 col-lg-3 border-end bg-light overflow-auto rounded shadow-sm" style={{ maxHeight: "75vh", padding: "0.5rem" }}>
          <h5 className="fw-bold mb-2 text-center text-md-start">Adopters</h5>
          <div className="list-group list-group-flush">
            {chatRooms.length === 0 && <p className="text-center text-muted mt-2">No adopters yet.</p>}
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleSelectRoom(room)}
                className={`list-group-item list-group-item-action d-flex flex-column py-2 ${selectedRoom?.id === room.id ? "active bg-primary text-white" : "bg-white"}`}
                style={{ borderRadius: "8px", margin: "3px 0", fontSize: "0.9rem" }}
              >
                <strong>{room.adopter.username}</strong>
                <span className="text-muted small">Pet: {room.pet.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="col-12 col-md-8 col-lg-9 d-flex flex-column bg-white rounded shadow-sm">
          {selectedRoom ? (
            <>
              <div className="border-bottom pb-1 mb-1 px-2 d-flex justify-content-between align-items-center bg-primary text-white rounded-top">
                <div>
                  <h5 className="fw-bold mb-0" style={{ fontSize: "1rem" }}>{selectedRoom.adopter.username}</h5>
                  <small>Pet: {selectedRoom.pet.name}</small>
                </div>
              </div>

              <div className="flex-grow-1 p-2 overflow-auto" style={{ maxHeight: "calc(75vh - 130px)", backgroundColor: "#f0f2f5", borderRadius: "0 0 8px 8px" }}>
                {groupedMessages.map((group, index) => {
                  const isOwner = group.senderId === requestUserId;
                  return (
                    <div key={index} className={`d-flex flex-column mb-2 align-items-${isOwner ? "end" : "start"}`}>
                      {!isOwner && <div className="small fw-bold mb-1 text-muted" style={{ fontSize: "0.75rem" }}>{group.senderName}</div>}
                      {group.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-2 mb-1 rounded-2 shadow-sm ${isOwner ? "bg-primary text-white" : "bg-white border"}`}
                          style={{ maxWidth: "60%", wordBreak: "break-word", fontSize: "0.85rem" }}
                        >
                          {msg.message}
                          <div className="text-muted small text-end mt-1" style={{ fontSize: "0.7rem" }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Send Message */}
              <div className="d-flex p-2 border-top bg-white">
                <input
                  type="text"
                  className="form-control me-2 rounded-pill border-0 shadow-sm"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  style={{ backgroundColor: "#f0f2f5", fontSize: "0.9rem" }}
                />
                <button className="btn btn-primary rounded-circle px-3 shadow-sm" onClick={sendMessage}>
                  &#9658;
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted fs-6">
              Select an adopter to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerChatPage;
