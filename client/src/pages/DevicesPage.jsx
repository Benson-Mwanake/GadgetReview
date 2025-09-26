import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import API_URL from "../config";


function fetchAllDevices() {
  return fetch(`${API_URL}/api/devices`).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch devices");
    return res.json();
  });
}

function deleteDevice(id) {
  return fetch(`${API_URL}/api/devices/${id}`, { method: "DELETE" }).then(
    (res) => {
      if (!res.ok) throw new Error("Failed to delete device");
      return res.json();
    }
  );
}

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    fetchAllDevices()
      .then((data) => setDevices(data))
      .catch((err) => console.error("Error fetching devices:", err))
      .finally(() => setLoading(false));
  }, []);

  function handleDeleteDevice(deviceId) {
    if (window.confirm("Are you sure you want to delete this device?")) {
      deleteDevice(deviceId)
        .then(() =>
          setDevices((prevDevices) =>
            prevDevices.filter((d) => d.id !== deviceId)
          )
        )
        .catch((err) => alert("Failed to delete: " + err.message));
    }
  }

  const filteredDevices = devices
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .filter((d) => (filterType === "All" ? true : d.category === filterType))
    .filter((d) => (budget ? d.avg_price <= parseInt(budget) : true))
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.avg_price - b.avg_price;
      if (sortOrder === "high-low") return b.avg_price - a.avg_price;
      return 0;
    });

  if (loading) return <p>Loading devices...</p>;

  return (
    <div className="container">
      <div className="page-header">
        <h1>Devices Catalog</h1>
        <p>Search, filter, and sort to find the perfect gadget.</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Smartphone">Smartphones</option>
          <option value="Laptop">Laptops</option>
          <option value="Tablet">Tablets</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="default">Sort by</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
        <input
          type="number"
          placeholder="Max Budget (Ksh)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="budget-input"
        />
      </div>

      <div className="device-grid">
        {filteredDevices.length > 0 ? (
          filteredDevices.map((device) => (
            <div key={device.id} className="device-card">
              <img
                src={device.image_url || "/placeholder-device.png"}
                alt={device.name}
                className="device-img"
              />
              <div className="device-text">
                <h3>{device.name}</h3>
                <p className="device-type">{device.category}</p>
                <p className="device-specs">{device.specs}</p>
                <p className="device-price">Ksh {device.avg_price}</p>
                <Link to={`/devices/${device.id}`} className="btn primary">
                  View More
                </Link>
                <button
                  className="device-btn"
                  onClick={() => handleDeleteDevice(device.id)}
                  style={{ marginLeft: "10px" }}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No devices match your search and filters.</p>
        )}
      </div>
    </div>
  );
}
