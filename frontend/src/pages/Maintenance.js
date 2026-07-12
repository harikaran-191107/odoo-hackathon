import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyMaintForm = { vehicle: "", description: "", date: "" };
const emptyFuelForm = { vehicle: "", liters: "", cost: "", date: "" };
const emptyExpenseForm = { type: "Toll", amount: "", date: "", notes: "" };

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [maintForm, setMaintForm] = useState(emptyMaintForm);
  const [fuelForm, setFuelForm] = useState(emptyFuelForm);
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    const [maintRes, vehiclesRes, fuelRes, expenseRes] = await Promise.all([
      api.get("/maintenance"),
      api.get("/vehicles"),
      api.get("/fuel"),
      api.get("/expenses"),
    ]);
    setRecords(maintRes.data);
    setVehicles(vehiclesRes.data);
    setFuelLogs(fuelRes.data);
    setExpenses(expenseRes.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ---- Maintenance ----
  const handleMaintSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/maintenance", maintForm);
      setMaintForm(emptyMaintForm);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create maintenance record");
    }
  };

  const handleCloseMaintenance = async (id) => {
    try {
      await api.put(`/maintenance/${id}/close`);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to close maintenance record");
    }
  };

  // ---- Fuel ----
  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/fuel", { ...fuelForm, liters: Number(fuelForm.liters), cost: Number(fuelForm.cost) });
      setFuelForm(emptyFuelForm);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log fuel entry");
    }
  };

  // ---- Expenses ----
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/expenses", { ...expenseForm, amount: Number(expenseForm.amount) });
      setExpenseForm(emptyExpenseForm);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to log expense");
    }
  };

  return (
    <div className="page">
      <h1>Maintenance, Fuel &amp; Expenses</h1>
      {error && <div className="alert alert-error">{error}</div>}

      {/* Maintenance */}
      <form className="card form-grid" onSubmit={handleMaintSubmit}>
        <h2>Add Maintenance Record</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Vehicle</label>
            <select
              value={maintForm.vehicle}
              onChange={(e) => setMaintForm({ ...maintForm, vehicle: e.target.value })}
              required
            >
              <option value="">Select vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              value={maintForm.description}
              onChange={(e) => setMaintForm({ ...maintForm, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={maintForm.date}
              onChange={(e) => setMaintForm({ ...maintForm, date: e.target.value })}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add Record</button>
        </div>
      </form>

      <div className="card">
        <table>
          <thead>
            <tr><th>Vehicle</th><th>Description</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{r.vehicle?.registrationNumber || "-"}</td>
                <td>{r.description}</td>
                <td>{r.date ? r.date.substring(0, 10) : "-"}</td>
                <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                <td className="actions">
                  {r.status === "Open" && (
                    <button className="btn btn-small btn-success" onClick={() => handleCloseMaintenance(r._id)}>Close</button>
                  )}
                </td>
              </tr>
            ))}
            {records.length === 0 && <tr><td colSpan="5" className="empty">No maintenance records yet</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Fuel */}
      <form className="card form-grid" onSubmit={handleFuelSubmit}>
        <h2>Add Fuel Log</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Vehicle</label>
            <select
              value={fuelForm.vehicle}
              onChange={(e) => setFuelForm({ ...fuelForm, vehicle: e.target.value })}
              required
            >
              <option value="">Select vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Liters</label>
            <input type="number" value={fuelForm.liters} onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })} required min="0" />
          </div>
          <div className="form-group">
            <label>Cost</label>
            <input type="number" value={fuelForm.cost} onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })} required min="0" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={fuelForm.date} onChange={(e) => setFuelForm({ ...fuelForm, date: e.target.value })} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add Fuel Log</button>
        </div>
      </form>

      <div className="card">
        <table>
          <thead><tr><th>Vehicle</th><th>Liters</th><th>Cost</th><th>Date</th></tr></thead>
          <tbody>
            {fuelLogs.map((f) => (
              <tr key={f._id}>
                <td>{f.vehicle?.registrationNumber || "-"}</td>
                <td>{f.liters} L</td>
                <td>{f.cost}</td>
                <td>{f.date ? f.date.substring(0, 10) : "-"}</td>
              </tr>
            ))}
            {fuelLogs.length === 0 && <tr><td colSpan="4" className="empty">No fuel logs yet</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Expenses */}
      <form className="card form-grid" onSubmit={handleExpenseSubmit}>
        <h2>Add Expense</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select value={expenseForm.type} onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })}>
              <option>Toll</option>
              <option>Repair</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} required min="0" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <input value={expenseForm.notes} onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Add Expense</button>
        </div>
      </form>

      <div className="card">
        <table>
          <thead><tr><th>Type</th><th>Amount</th><th>Date</th><th>Notes</th></tr></thead>
          <tbody>
            {expenses.map((ex) => (
              <tr key={ex._id}>
                <td>{ex.type}</td>
                <td>{ex.amount}</td>
                <td>{ex.date ? ex.date.substring(0, 10) : "-"}</td>
                <td>{ex.notes || "-"}</td>
              </tr>
            ))}
            {expenses.length === 0 && <tr><td colSpan="4" className="empty">No expenses yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;
