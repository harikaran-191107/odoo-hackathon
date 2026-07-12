import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { registrationNumber: "", name: "", type: "", capacity: "", status: "Available" };

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVehicles = async () => {
    const { data } = await api.get("/vehicles");
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, payload);
      } else {
        await api.post("/vehicles", payload);
      }
      resetForm();
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    setForm({
      registrationNumber: vehicle.registrationNumber,
      name: vehicle.name,
      type: vehicle.type,
      capacity: vehicle.capacity,
      status: vehicle.status,
    });
    setEditingId(vehicle._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete vehicle");
    }
  };

  return (
    <div className="page">
      <h1>Vehicles</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form className="card form-grid" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Vehicle" : "Add Vehicle"}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Registration Number</label>
            <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Type</label>
            <input name="type" value={form.type} onChange={handleChange} required placeholder="Truck, Van..." />
          </div>
          <div className="form-group">
            <label>Capacity (kg)</label>
            <input type="number" name="capacity" value={form.capacity} onChange={handleChange} required min="0" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Available</option>
              <option>On Trip</option>
              <option>In Shop</option>
              <option>Retired</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {editingId ? "Update Vehicle" : "Add Vehicle"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Reg. No.</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v._id}>
                <td>{v.registrationNumber}</td>
                <td>{v.name}</td>
                <td>{v.type}</td>
                <td>{v.capacity} kg</td>
                <td><span className={`badge badge-${v.status.replace(/\s+/g, "-").toLowerCase()}`}>{v.status}</span></td>
                <td className="actions">
                  <button className="btn btn-small" onClick={() => handleEdit(v)}>Edit</button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(v._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr><td colSpan="6" className="empty">No vehicles yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;
