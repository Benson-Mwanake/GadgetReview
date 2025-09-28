const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://gadgetreview-5c3b.onrender.com" 
    : "http://localhost:5000"; 
export default API_URL;