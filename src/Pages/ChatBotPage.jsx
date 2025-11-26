// src/Pages/ChatBotPage.jsx
import React from "react";
import ChatBot from "src/Pages/ChatBot";



const ChatBotPage = () => {
  return (
    <div style={pageStyles.container}>
      <h3 style={pageStyles.title}>💬 PawsNest Chat Assistant</h3>
      <p style={pageStyles.subtitle}>
        Ask anything about pets, adoption, or care — PawsNestBot is here to help 🐾
      </p>
      <ChatBot />
    </div>
  );
};

const pageStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    minHeight: "100vh",
    padding: "40px 20px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    marginBottom: "10px",
    fontWeight: "bold",
    color: "#ff6b6b",
  },
  subtitle: {
    marginBottom: "25px",
    color: "#666",
    fontSize: "14px",
  },
};

export default ChatBotPage;
