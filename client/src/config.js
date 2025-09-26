// src/config.js
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://gadgetreview-backend.onrender.com" // 🔹 your Render backend
    : "http://localhost:5000"; // 🔹 local backend

export default API_URL;
