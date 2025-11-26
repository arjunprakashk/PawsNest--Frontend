import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = "http://localhost:8000/api";

const ChatPage = () => {
  const { petId } = useParams();
  const token = localStorage.getItem("access_token");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // fetch messages
  const fetchMessages = async () => {
    const res = await fetch(`${BASE_URL}/chat/${petId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const res = await fetch(`${BASE_URL}/chat/${petId}/send/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: newMessage }),
    });
    if (res.ok) {
      const data = await res.json();
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // auto-refresh every 2s
    return () => clearInterval(interval);
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "20px",
      background:
        "linear-gradient(135deg, #e0f2fe 0%, #f8fafc 50%, #e0f2fe 100%)",
      fontFamily:
        "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    chatBox: {
      width: "100%",
      maxWidth: "600px",
      background: "#fff",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      display: "flex",
      flexDirection: "column",
      height: "80vh",
      border: "1px solid #e5e7eb",
    },
    header: {
      fontSize: "20px",
      fontWeight: "700",
      textAlign: "center",
      color: "#1e3a8a",
      marginBottom: "12px",
    },
    messagesArea: {
      flexGrow: 1,
      overflowY: "auto",
      padding: "12px",
      background: "#f9fafb",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      marginBottom: "14px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      scrollBehavior: "smooth",
    },
    messageWrapper: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "75%",
    },
    messageBubble: {
      padding: "10px 14px",
      borderRadius: "16px",
      wordWrap: "break-word",
      fontSize: "15px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      lineHeight: 1.4,
    },
    senderBubble: {
      alignSelf: "flex-end",
      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      color: "#fff",
      borderBottomRightRadius: "4px",
    },
    receiverBubble: {
      alignSelf: "flex-start",
      background: "#f3f4f6",
      color: "#111827",
      borderBottomLeftRadius: "4px",
    },
    senderLabel: {
      fontSize: "12px",
      color: "#6b7280",
      textAlign: "right",
      marginTop: "2px",
    },
    receiverLabel: {
      fontSize: "12px",
      color: "#6b7280",
      textAlign: "left",
      marginTop: "2px",
    },
    inputArea: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
    },
    input: {
      flex: 1,
      padding: "12px 14px",
      borderRadius: "10px",
      border: "1px solid #d1d5db",
      outline: "none",
      fontSize: "15px",
      transition: "border 0.2s ease",
    },
    button: {
      background: "linear-gradient(90deg, #2563eb, #1d4ed8)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "12px 20px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background 0.3s ease, transform 0.2s ease",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <h3 style={styles.header}>Chat about Pet {petId}</h3>

        <div style={styles.messagesArea}>
          {messages.map((msg) => {
            const isSender = msg.is_sender || msg.sender?.is_you;
            return (
              <div
                key={msg.id}
                style={{
                  ...styles.messageWrapper,
                  alignSelf: isSender ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(isSender
                      ? styles.senderBubble
                      : styles.receiverBubble),
                  }}
                >
                  {msg.message}
                </div>
                <div
                  style={
                    isSender
                      ? styles.senderLabel
                      : styles.receiverLabel
                  }
                >
                  {msg.sender?.username || "User"}
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            style={styles.input}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            style={styles.button}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #1e40af, #1d4ed8)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(90deg, #2563eb, #1d4ed8)")
            }
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>

      {/* Inline responsive tweaks */}
      <style>
        {`
          @media (max-width: 600px) {
            div[style*="max-width: 600px"] {
              height: 85vh !important;
              padding: 18px !important;
            }
            input {
              font-size: 14px !important;
            }
            button {
              padding: 10px 16px !important;
              font-size: 14px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatPage;
