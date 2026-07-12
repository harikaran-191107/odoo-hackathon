import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Trips from "./pages/Trips";
import Maintenance from "./pages/Maintenance";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <PrivateRoute>
                <Vehicles />
              </PrivateRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              <PrivateRoute>
                <Drivers />
              </PrivateRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <PrivateRoute>
                <Trips />
              </PrivateRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <PrivateRoute>
                <Maintenance />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
