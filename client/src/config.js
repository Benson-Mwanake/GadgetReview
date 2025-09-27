const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://gadgetreview-5c3b.onrender.com" // 🔹 Render backend URL
    : "http://localhost:5000"; // 🔹 Local backend
export default API_URL;