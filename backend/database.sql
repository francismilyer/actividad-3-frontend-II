CREATE DATABASE IF NOT EXISTS reactvet_db;
USE reactvet_db;

-- Entidad 1: Clientes (Dueños)
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Entidad 2: Pacientes (Mascotas) - CRUD 1
CREATE TABLE pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(50),
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Entidad 3: Productos (Catálogo) - CRUD 2
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

-- Entidad 4: Citas - CRUD 3
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id INT,
    fecha DATETIME NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- Datos iniciales
INSERT INTO productos (nombre, categoria, precio, stock) VALUES 
('Antiparasitario NexGard', 'Medicina', 25.50, 50),
('Alimento Premium DogChow 15kg', 'Alimento', 45.00, 20);