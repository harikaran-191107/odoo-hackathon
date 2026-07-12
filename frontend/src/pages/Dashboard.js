import { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard");
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      {error && <div className="alert alert-error">{error}</div>}
      {!stats && !error && <p>Loading...</p>}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalVehicles}</div>
            <div className="stat-label">Total Vehicles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.availableVehicles}</div>
            <div className="stat-label">Available Vehicles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activeTrips}</div>
            <div className="stat-label">Active Trips</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.availableDrivers}</div>
            <div className="stat-label">Available Drivers</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
