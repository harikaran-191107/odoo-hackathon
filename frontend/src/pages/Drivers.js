import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = { name: "", licenseNumber: "", licenseExpiry: "", status: "Available" };

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDrivers = async () => {
    const { data } = await api.get("/drivers");
    setDrivers(data);
  };

  useEffect(() => {
    fetchDrivers();
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
      if (editingId) {
        await api.put(`/drivers/${editingId}`, form);
      } else {
        await api.post("/drivers", form);
      }
      resetForm();
      fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save driver");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (driver) => {
    setForm({
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry ? driver.licenseExpiry.substring(0, 10) : "",
      status: driver.status,
    });
    setEditingId(driver._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    try {
      await api.delete(`/drivers/${id}`);
      fetchDrivers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete driver");
    }
  };

  return (
    <div className="page">
      <h1>Drivers</h1>
      {error && <div className="alert alert-error">{error}</div>}

      <form className="card form-grid" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Driver" : "Add Driver"}</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>License Number</label>
            <input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>License Expiry</label>
            <input type="date" name="licenseExpiry" value={form.licenseExpiry} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Available</option>
              <option>On Trip</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {editingId ? "Update Driver" : "Add Driver"}
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
              <th>Name</th>
              <th>License No.</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>{d.licenseNumber}</td>
                <td>{d.licenseExpiry ? d.licenseExpiry.substring(0, 10) : "-"}</td>
                <td><span className={`badge badge-${d.status.replace(/\s+/g, "-").toLowerCase()}`}>{d.status}</span></td>
                <td className="actions">
                  <button className="btn btn-small" onClick={() => handleEdit(d)}>Edit</button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(d._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr><td colSpan="5" className="empty">No drivers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Drivers;
