-- TransitOps Smart Transport Operations Platform
-- Professional PostgreSQL Database Schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE vehicle_status AS ENUM
('available', 'on_trip', 'in_shop', 'retired');

CREATE TYPE driver_status AS ENUM
('available', 'on_trip', 'off_duty', 'suspended');

CREATE TYPE trip_status AS ENUM
('draft', 'dispatched', 'completed', 'cancelled');

CREATE TYPE maintenance_status AS ENUM
('active', 'completed');

CREATE TYPE expense_type AS ENUM
('toll', 'maintenance', 'parking', 'other');

CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(role_id),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    vehicle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    max_load_capacity DECIMAL(10,2) NOT NULL,
    odometer DECIMAL(10,2) DEFAULT 0,
    acquisition_cost DECIMAL(12,2),
    status vehicle_status DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE drivers (
    driver_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    license_category VARCHAR(20),
    license_expiry_date DATE NOT NULL,
    contact_number VARCHAR(20),
    safety_score DECIMAL(5,2) DEFAULT 100,
    status driver_status DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
    trip_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(vehicle_id),
    driver_id UUID REFERENCES drivers(driver_id),
    source_location VARCHAR(150) NOT NULL,
    destination_location VARCHAR(150) NOT NULL,
    cargo_weight DECIMAL(10,2) NOT NULL,
    planned_distance DECIMAL(10,2) NOT NULL,
    actual_distance DECIMAL(10,2),
    revenue DECIMAL(12,2),
    status trip_status DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_logs (
    maintenance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(vehicle_id),
    maintenance_type VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    cost DECIMAL(12,2),
    status maintenance_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fuel_logs (
    fuel_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(vehicle_id),
    trip_id UUID REFERENCES trips(trip_id),
    fuel_date DATE NOT NULL,
    liters DECIMAL(10,2) NOT NULL,
    cost DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    expense_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(vehicle_id),
    trip_id UUID REFERENCES trips(trip_id),
    expense_type expense_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    expense_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX idx_trips_driver ON trips(driver_id);
CREATE INDEX idx_fuel_logs_vehicle ON fuel_logs(vehicle_id);
CREATE INDEX idx_expenses_vehicle ON expenses(vehicle_id);

INSERT INTO roles (role_name, description) VALUES
('Fleet Manager', 'Manages vehicles and maintenance'),
('Dispatcher', 'Creates and dispatches trips'),
('Driver', 'Executes assigned trips'),
('Safety Officer', 'Monitors driver compliance'),
('Financial Analyst', 'Analyzes expenses and profitability');
