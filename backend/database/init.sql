-- Script d'initialisation de la base de données pour l'application de gestion des vacataires 2iE

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS vacataires_db;
USE vacataires_db;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'rh', 'vacataire') DEFAULT 'vacataire',
    firstName VARCHAR(50),
    lastName VARCHAR(50),
    phone VARCHAR(20),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des vacataires
CREATE TABLE IF NOT EXISTS vacataires (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT UNIQUE,
    specialization VARCHAR(200),
    experienceYears INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    cvFile VARCHAR(255),
    diplomaFile VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des cours
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    hoursPerWeek INT,
    totalHours INT,
    semester VARCHAR(20),
    department VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des candidatures
CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vacataireId INT,
    courseId INT,
    status ENUM('submitted', 'reviewed', 'approved', 'rejected') DEFAULT 'submitted',
    submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewedAt TIMESTAMP NULL,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vacataireId) REFERENCES vacataires(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE
);

-- Table des contrats
CREATE TABLE IF NOT EXISTS contracts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    applicationId INT,
    contractNumber VARCHAR(50) UNIQUE NOT NULL,
    hourlyRate DECIMAL(10,2) NOT NULL,
    totalHours INT NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    status ENUM('draft', 'active', 'completed') DEFAULT 'draft',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (applicationId) REFERENCES applications(id) ON DELETE CASCADE
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contractId INT,
    amount DECIMAL(10,2) NOT NULL,
    dueDate DATE NOT NULL,
    paidDate DATE NULL,
    status ENUM('pending', 'paid') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contractId) REFERENCES contracts(id) ON DELETE CASCADE
);

-- Insérer des données de test

-- Utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO users (email, password, role, firstName, lastName, phone) VALUES
('admin@2ie.edu.bf', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin', '2iE', '+226 70 12 34 56');

-- Utilisateur RH par défaut (mot de passe: rh123)
INSERT INTO users (email, password, role, firstName, lastName, phone) VALUES
('rh@2ie.edu.bf', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'rh', 'RH', 'Manager', '+226 70 12 34 57');

-- Quelques vacataires de test
INSERT INTO users (email, password, role, firstName, lastName, phone) VALUES
('vacataire1@2ie.edu.bf', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vacataire', 'Jean', 'Dupont', '+226 70 12 34 58'),
('vacataire2@2ie.edu.bf', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vacataire', 'Marie', 'Martin', '+226 70 12 34 59'),
('vacataire3@2ie.edu.bf', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vacataire', 'Pierre', 'Kaboré', '+226 70 12 34 60');

-- Profils vacataires
INSERT INTO vacataires (userId, specialization, experienceYears, status) VALUES
(3, 'Informatique - Développement Web', 5, 'approved'),
(4, 'Génie Civil - Structures', 3, 'approved'),
(5, 'Management - Gestion de Projet', 7, 'pending');

-- Cours de test
INSERT INTO courses (code, name, hoursPerWeek, totalHours, semester, department) VALUES
('INFO101', 'Programmation Web', 3, 45, 'S1', 'Informatique'),
('INFO102', 'Base de Données', 3, 45, 'S1', 'Informatique'),
('GC101', 'Mécanique des Sols', 4, 60, 'S2', 'Génie Civil'),
('GC102', 'Béton Armé', 4, 60, 'S2', 'Génie Civil'),
('MGT101', 'Gestion de Projet', 3, 45, 'S1', 'Management'),
('MGT102', 'Comptabilité Générale', 3, 45, 'S1', 'Management'),
('ELEC101', 'Électronique Numérique', 4, 60, 'S2', 'Génie Électrique'),
('MECA101', 'Mécanique des Fluides', 4, 60, 'S2', 'Génie Mécanique');

-- Quelques candidatures de test
INSERT INTO applications (vacataireId, courseId, status, notes) VALUES
(1, 1, 'approved', 'Excellent profil, expérience confirmée'),
(1, 2, 'submitted', NULL),
(2, 3, 'approved', 'Très bon candidat pour ce cours'),
(2, 4, 'reviewed', 'En cours d\'évaluation'),
(3, 5, 'submitted', NULL);

-- Contrats de test
INSERT INTO contracts (applicationId, contractNumber, hourlyRate, totalHours, totalAmount, startDate, endDate, status) VALUES
(1, 'CONTRACT-2024-001', 5000, 45, 225000, '2024-01-15', '2024-04-15', 'active'),
(3, 'CONTRACT-2024-002', 5000, 60, 300000, '2024-02-01', '2024-05-01', 'draft');

-- Paiements de test
INSERT INTO payments (contractId, amount, dueDate, status) VALUES
(1, 112500, '2024-02-15', 'paid'),
(1, 112500, '2024-03-15', 'pending'),
(2, 150000, '2024-03-01', 'pending'),
(2, 150000, '2024-04-01', 'pending');

-- Afficher un message de confirmation
SELECT 'Base de données initialisée avec succès!' as message;
SELECT 'Comptes de test créés:' as info;
SELECT 'Admin: admin@2ie.edu.bf (mot de passe: admin123)' as admin_account;
SELECT 'RH: rh@2ie.edu.bf (mot de passe: rh123)' as rh_account;
SELECT 'Vacataires: vacataire1@2ie.edu.bf, vacataire2@2ie.edu.bf, vacataire3@2ie.edu.bf (mot de passe: vacataire123)' as vacataire_accounts;