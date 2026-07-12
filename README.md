TransitOps – Smart Transport Operations Platform

A full-stack transport management system built for an 8-hour hackathon. Handles
vehicles, drivers, trips, maintenance, and fuel/expense tracking with automatic
status transitions driven by business rules.

**Stack:** React (frontend) · Node.js + Express (backend) · MongoDB + Mongoose (database) · JWT auth

Both the backend and frontend have been installed and build-tested during
development (`npm install` + `npm run build` completed successfully), so the
code is verified to be free of syntax errors. You will still need a running
MongoDB instance to use the app.

---

## 1. Prerequisites

- Node.js v18+ and npm
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** a MongoDB Atlas connection string

If you don't have MongoDB installed locally, the fastest option is a free
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster — just
copy its connection string into `backend/.env`.

---

## 2. Project Structure

```
transitops/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # Mongoose schemas (7 collections)
│   ├── controllers/               # Business logic
│   ├── routes/                    # Express route definitions
│   ├── middleware/auth.js         # JWT protect + role authorize
│   ├── middleware/errorHandler.js # Central error handling
│   ├── server.js                  # App entry point
│   ├── seed.js                    # Creates a default Admin user
│   └── package.json
└── frontend/
    ├── public/index.html
    └── src/
        ├── api/axios.js           # Axios instance with JWT interceptor
        ├── context/AuthContext.js # Login/register/logout state
        ├── components/            # Navbar, PrivateRoute
        ├── pages/                 # Login, Dashboard, Vehicles, Drivers, Trips, Maintenance
        └── App.js
```

---

## 3. Setup & Run — Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` if needed (defaults work for a local MongoDB):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/transitops
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
```

Create a default login (Admin: `admin@transitops.com` / `admin123`):

```bash
npm run seed
```

Start the server:

```bash
npm start
# or for auto-reload during development:
npm run dev
```

The API runs at `http://localhost:5000`. Visiting `http://localhost:5000/`
should return `{"message":"TransitOps API is running"}`.

---

## 4. Setup & Run — Frontend

Open a **second terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

This opens `http://localhost:3000` in your browser. Log in with:

```
Email:    admin@transitops.com
Password: admin123
```

(Or register a new user via `POST /api/auth/register` if you prefer.)

---

## 5. End-to-End Demo Flow

1. **Add a Vehicle** — e.g. reg. `TN01AB1234`, name `Tata Ace`, type `Truck`, capacity `1000`
2. **Add a Driver** — e.g. name `Ravi Kumar`, license `DL12345`, expiry any future date
3. **Create a Trip** — pick the vehicle/driver you just added (they only appear if `Available`), enter a cargo weight ≤ vehicle capacity
   → Vehicle and driver automatically flip to `On Trip`
4. **Complete the Trip** — click "Complete" on the Trips page
   → Vehicle and driver automatically flip back to `Available`
5. **Send a vehicle to Maintenance** — adds a record and sets the vehicle to `In Shop`; click "Close" to set it back to `Available`
6. **Dashboard** — shows live counts of total/available vehicles, active trips, and available drivers

---

## 6. API Endpoints

All routes except `/api/auth/register` and `/api/auth/login` require
`Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user (Admin/Manager) |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current logged-in user |

### Vehicles
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/vehicles` | List all vehicles |
| GET | `/api/vehicles/:id` | Get one vehicle |
| POST | `/api/vehicles` | Create vehicle |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |

### Drivers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/drivers` | List all drivers |
| GET | `/api/drivers/:id` | Get one driver |
| POST | `/api/drivers` | Create driver |
| PUT | `/api/drivers/:id` | Update driver |
| DELETE | `/api/drivers/:id` | Delete driver |

### Trips (business rules enforced server-side)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trips` | List all trips (populated) |
| GET | `/api/trips/:id` | Get one trip |
| POST | `/api/trips` | Create trip — requires vehicle & driver `Available`, cargoWeight ≤ vehicle capacity; sets both to `On Trip` |
| PUT | `/api/trips/:id/complete` | Mark trip Completed; resets vehicle & driver to `Available` |
| PUT | `/api/trips/:id/cancel` | Cancel an ongoing trip; resets vehicle & driver to `Available` |
| DELETE | `/api/trips/:id` | Delete trip record |

### Maintenance
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/maintenance` | List all records |
| POST | `/api/maintenance` | Create record; sets vehicle to `In Shop` |
| PUT | `/api/maintenance/:id/close` | Close record; sets vehicle to `Available` |
| DELETE | `/api/maintenance/:id` | Delete record |

### Fuel Logs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/fuel` | List all fuel logs |
| POST | `/api/fuel` | Add fuel log |
| DELETE | `/api/fuel/:id` | Delete fuel log |

### Expenses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | List all expenses |
| POST | `/api/expenses` | Add expense (type: Toll/Repair/Other) |
| DELETE | `/api/expenses/:id` | Delete expense |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Returns `{ totalVehicles, availableVehicles, activeTrips, availableDrivers }` |

---

## 7. Business Rules Implemented

- **Trip creation** is blocked unless the chosen vehicle status is `Available`
  AND the chosen driver status is `Available`, AND `cargoWeight <= vehicle.capacity`.
  All three checks happen server-side in `tripController.js`, so they can't be
  bypassed by calling the API directly.
- Creating a trip atomically flips `vehicle.status` and `driver.status` to `On Trip`.
- Completing a trip flips both back to `Available`.
- Creating a maintenance record sets `vehicle.status = "In Shop"` (blocked if the
  vehicle is currently `On Trip`); closing it sets it back to `Available`.

## 8. Notes

- Passwords are hashed with bcrypt before being stored.
- JWTs are signed with `JWT_SECRET` from `.env` — change this for any real deployment.
- This is a hackathon-scope project: there's no pagination, rate-limiting, or
  automated test suite, and the UI intentionally keeps styling minimal so you
  can focus on demoing the business logic.## How to Run

**##how to run**

1. Clone repo
2. cd backend → npm install → node server.js
3. cd frontend → npm install → npm start
4. Setup MongoDB

**Login page**
<img width="1915" height="923" alt="image" src="https://github.com/user-attachments/assets/c62fb4cd-9e24-4c8b-9ec2-e5edfb511e29" />

**Dashboard page**
<img width="1908" height="917" alt="image" src="https://github.com/user-attachments/assets/0697b7a0-488d-48e2-bdc5-b4d32b666667" />



