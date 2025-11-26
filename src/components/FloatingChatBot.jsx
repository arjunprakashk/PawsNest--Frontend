// src/components/FloatingChatBot.jsx
import React, { useState } from "react";
import ChatBot from "src/Pages/ChatBot"; // ✅ correct relative path
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import robotAnimation from "src/assets/robot.json"; // ✅ adjust if needed

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      {/* Floating Robot Button */}
      <div
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {isHovering && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              style={{
                backgroundColor: "#008cff",
                color: "white",
                padding: "6px 14px",
                borderRadius: "20px",
                marginBottom: "8px",
                fontSize: "13px",
                fontWeight: "500",
                boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
              }}
            >
              💬 Chat with PawsNest
            </motion.div>
          )}
        </AnimatePresence>

        {/* Robot Button */}
        <motion.div
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            cursor: "pointer",
            backgroundColor: "transparent",
          }}
        >
          <Lottie animationData={robotAnimation} loop autoplay />
        </motion.div>
      </div>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-popup"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              bottom: "160px",
              right: "40px",
              width: "360px",
              height: "480px",
              backgroundColor: "#fff",
              borderRadius: "20px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              overflow: "hidden",
              zIndex: 2100,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#0073ffff",
                color: "#fff",
                padding: "12px 15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              <span>🤖 PawsNest Assistant</span>
              <span
                style={{ cursor: "pointer", fontSize: "18px" }}
                onClick={() => setIsOpen(false)}
              >
                ✖
              </span>
            </div>

            {/* Chat Body */}
            <div
              style={{
                flex: 1,
                background: "#f8f9fa",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <ChatBot />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatBot;
