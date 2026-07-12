import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { source: "", destination: "", cargoWeight: "", vehicle: "", driver: "" };

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
      api.get("/trips"),
      api.get("/vehicles"),
      api.get("/drivers"),
    ]);
    setTrips(tripsRes.data);
    setVehicles(vehiclesRes.data);
    setDrivers(driversRes.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const availableVehicles = vehicles.filter((v) => v.status === "Available");
  const availableDrivers = drivers.filter((d) => d.status === "Available");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/trips", { ...form, cargoWeight: Number(form.cargoWeight) });
      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.put(`/trips/${id}/complete`);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete trip");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this trip?")) return;
    try {
      await api.put(`/trips/${id}/cancel`);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel trip");
    }
  };

  const selectedVehicle = vehicles.find((v) => v._id === form.vehicle);

  return (
    <div className="page">
      <h1>Trips</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form className="card form-grid" onSubmit={handleSubmit}>
        <h2>Create Trip</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Source</label>
            <input name="source" value={form.source} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Destination</label>
            <input name="destination" value={form.destination} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>
              Cargo Weight (kg)
              {selectedVehicle && <span className="hint"> — max {selectedVehicle.capacity} kg</span>}
            </label>
            <input type="number" name="cargoWeight" value={form.cargoWeight} onChange={handleChange} required min="0" />
          </div>
          <div className="form-group">
            <label>Vehicle (Available only)</label>
            <select name="vehicle" value={form.vehicle} onChange={handleChange} required>
              <option value="">Select vehicle</option>
              {availableVehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.registrationNumber} - {v.name} (cap: {v.capacity}kg)
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Driver (Available only)</label>
            <select name="driver" value={form.driver} onChange={handleChange} required>
              <option value="">Select driver</option>
              {availableDrivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.licenseNumber})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Create Trip
          </button>
        </div>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Destination</th>
              <th>Cargo</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((t) => (
              <tr key={t._id}>
                <td>{t.source}</td>
                <td>{t.destination}</td>
                <td>{t.cargoWeight} kg</td>
                <td>{t.vehicle?.registrationNumber || "-"}</td>
                <td>{t.driver?.name || "-"}</td>
                <td><span className={`badge badge-${t.status.toLowerCase()}`}>{t.status}</span></td>
                <td className="actions">
                  {t.status === "Ongoing" && (
                    <>
                      <button className="btn btn-small btn-success" onClick={() => handleComplete(t._id)}>Complete</button>
                      <button className="btn btn-small btn-danger" onClick={() => handleCancel(t._id)}>Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {trips.length === 0 && (
              <tr><td colSpan="7" className="empty">No trips yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trips;
