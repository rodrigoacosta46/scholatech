-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2024 at 11:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scholatech`
--

-- --------------------------------------------------------

--
-- Table structure for table `historial`
--

CREATE TABLE `historial` (
  `id` int(11) NOT NULL,
  `turno_id` int(11) NOT NULL,
  `diagnostico` text NOT NULL,
  `tratamiento` text NOT NULL,
  `notas` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `historial`
--

INSERT INTO `historial` (`id`, `turno_id`, `diagnostico`, `tratamiento`, `notas`) VALUES
(1, 1, 'Hipertensión', 'Medicamento antihipertensivo', 'Recomendado cambios en la dieta y actividad física.'),
(2, 2, 'Gastroenteritis', 'Reposo, hidratación y dieta blanda', 'Se recomienda seguimiento en una semana.'),
(3, 3, 'Dermatitis alérgica', 'Aplicación de crema antihistamínica', 'Se recomienda evitar contacto con alérgenos conocidos.'),
(4, 4, 'Disminorrea', 'Ibuprofeno 400mg', 'Se recomienda seguimiento en 3 meses.'),
(5, 5, 'Migraña', 'Tratamiento con triptanos', 'Controlar factores desencadenantes y reducir estrés.'),
(6, 6, 'Revisión normal', 'Sin tratamiento', 'El niño está creciendo de manera saludable.'),
(7, 7, 'Gastritis', 'Omeprazol 20mg por 14 días', 'Se recomienda evitar alimentos irritantes y consumo de alcohol.');

-- --------------------------------------------------------

--
-- Table structure for table `medicamentos`
--

CREATE TABLE `medicamentos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `imagen` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicamentos`
--

INSERT INTO `medicamentos` (`id`, `nombre`, `descripcion`, `imagen`) VALUES
(1, 'Paracetamol', 'Analgésico y antipirético utilizado para aliviar el dolor y reducir la fiebre.', '/img/medicamentos/paracetamol.jpg'),
(2, 'Ibuprofeno', 'Antiinflamatorio no esteroideo utilizado para reducir la inflamación y el dolor.', '/img/medicamentos/ibuprofeno.jpg'),
(3, 'Amoxicilina', 'Antibiótico utilizado para tratar infecciones bacterianas.', '/img/medicamentos/amoxicilina.jpg'),
(4, 'Loratadina', 'Antihistamínico utilizado para tratar alergias.', '/img/medicamentos/loratadina.jpg'),
(5, 'Omeprazol', 'Inhibidor de la bomba de protones utilizado para tratar el reflujo ácido.', '/img/medicamentos/omeprazol.jpg'),
(6, 'Salbutamol', 'Broncodilatador utilizado para aliviar los síntomas del asma.', '/img/medicamentos/salbutamol.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_envio` datetime NOT NULL,
  `estado` enum('pendiente','leido','enviado','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notificaciones`
--

INSERT INTO `notificaciones` (`id`, `usuario_id`, `mensaje`, `fecha_envio`, `estado`) VALUES
(1, 4, 'Recordatorio: Tiene una cita con el Dr. Luis López el 20 de agosto de 2024 a las 10:00 AM.', '2024-08-19 09:00:00', 'pendiente'),
(2, 2, 'Recordatorio: Tiene un turno con el paciente Juan Pérez el 20 de agosto de 2024 a las 10:00 AM.', '2024-08-19 09:00:00', 'pendiente'),
(3, 5, 'Recordatorio: Tiene una cita con la Dra. María González el 21 de agosto de 2024 a las 11:00 AM.', '2024-08-20 09:00:00', 'pendiente'),
(4, 3, 'Recordatorio: Tiene un turno con la paciente Ana Martínez el 21 de agosto de 2024 a las 11:00 AM.', '2024-08-20 09:00:00', 'pendiente'),
(5, 8, 'Recordatorio: Tiene una cita con el Dr. Carlos Fernández el 22 de agosto de 2024 a las 09:00 AM.', '2024-08-21 09:00:00', 'pendiente'),
(6, 6, 'Recordatorio: Tiene un turno con el paciente Carlos García el 22 de agosto de 2024 a las 09:00 AM.', '2024-08-21 09:00:00', 'pendiente'),
(7, 9, 'Recordatorio: Tiene una cita con la Dra. Laura Méndez el 23 de agosto de 2024 a las 10:30 AM.', '2024-08-22 09:00:00', 'pendiente'),
(8, 7, 'Recordatorio: Tiene un turno con la paciente Marta López el 23 de agosto de 2024 a las 10:30 AM.', '2024-08-22 09:00:00', 'pendiente'),
(9, 10, 'Recordatorio: Tiene una cita con el Dr. Luis López el 24 de agosto de 2024 a las 11:00 AM.', '2024-08-23 09:00:00', 'pendiente'),
(10, 2, 'Recordatorio: Tiene un turno con el paciente Sergio Ramírez el 24 de agosto de 2024 a las 11:00 AM.', '2024-08-23 09:00:00', 'pendiente'),
(11, 4, 'Recordatorio: Tiene una cita con la Dra. María González el 25 de agosto de 2024 a las 14:00 PM.', '2024-08-24 09:00:00', 'pendiente'),
(12, 3, 'Recordatorio: Tiene un turno con el paciente Juan Pérez el 25 de agosto de 2024 a las 14:00 PM.', '2024-08-24 09:00:00', 'pendiente'),
(13, 5, 'Recordatorio: Tiene una cita con la Dra. Laura Méndez el 26 de agosto de 2024 a las 15:00 PM.', '2024-08-25 09:00:00', 'pendiente'),
(14, 7, 'Recordatorio: Tiene un turno con la paciente Ana Martínez el 26 de agosto de 2024 a las 15:00 PM.', '2024-08-25 09:00:00', 'pendiente');

-- --------------------------------------------------------

--
-- Table structure for table `perfiles`
--

CREATE TABLE `perfiles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `perfiles`
--

INSERT INTO `perfiles` (`id`, `nombre`, `descripcion`) VALUES
(1, 'doctor', 'Administra pacientes'),
(2, 'paciente', 'Es atendido por el doctor'),
(3, 'moderador', 'Tiene control sobre el sistema');

-- --------------------------------------------------------

--
-- Table structure for table `recetas`
--

CREATE TABLE `recetas` (
  `id` int(11) NOT NULL,
  `historial_id` int(11) NOT NULL,
  `medicamento_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recetas`
--

INSERT INTO `recetas` (`id`, `historial_id`, `medicamento_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 4),
(4, 4, 2),
(5, 5, 6),
(6, 7, 5);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `perfil_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `usuario_id`, `perfil_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 2),
(4, 4, 3),
(5, 5, 3),
(6, 6, 2),
(7, 7, 2),
(8, 8, 3),
(9, 9, 3),
(10, 10, 3),
(11, 11, 1);

-- --------------------------------------------------------

--
-- Table structure for table `turnos`
--

CREATE TABLE `turnos` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `paciente_id` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `motivo` varchar(50) NOT NULL,
  `notas` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `turnos`
--

INSERT INTO `turnos` (`id`, `doctor_id`, `paciente_id`, `fecha`, `hora`, `motivo`, `notas`) VALUES
(1, 2, 4, '2024-08-20', '10:00:00', 'Chequeo general', 'Paciente presenta presión arterial elevada.'),
(2, 3, 5, '2024-08-21', '11:00:00', 'Dolor abdominal', 'Paciente refiere dolor abdominal severo.'),
(3, 6, 8, '2024-08-22', '09:00:00', 'Consulta por erupción cutánea', 'Paciente presenta erupción cutánea en brazos y cuello.'),
(4, 7, 9, '2024-08-23', '10:30:00', 'Chequeo ginecológico', 'Paciente refiere dolor abdominal.'),
(5, 2, 10, '2024-08-24', '11:00:00', 'Dolor de cabeza persistente', 'Paciente presenta dolor de cabeza desde hace dos semanas.'),
(6, 3, 4, '2024-08-25', '14:00:00', 'Revisión pediátrica', 'Revisión de rutina para evaluar el crecimiento y desarrollo del niño.'),
(7, 7, 5, '2024-08-26', '15:00:00', 'Consulta por dolor abdominal', 'Paciente refiere dolor abdominal intermitente.');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `clave` varchar(128) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `genero` enum('masculino','femenino','otros') NOT NULL,
  `nacimiento` date NOT NULL,
  `fecha_alta` datetime NOT NULL,
  `fecha_baja` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `correo`, `clave`, `telefono`, `direccion`, `especialidad`, `genero`, `nacimiento`, `fecha_alta`, `fecha_baja`) VALUES
(1, 'Administrador General', 'admin@example.com', 'claveAdmin', '123456789', 'Calle Principal 1', NULL, 'otros', '1980-01-01', '2024-01-01 00:00:00', NULL),
(2, 'Dr. Luis López', 'dr.lopez@example.com', 'claveDoctor1', '987654321', 'Calle Salud 123', 'Cardiología', 'masculino', '1975-04-12', '2024-01-05 00:00:00', NULL),
(3, 'Dra. María González', 'dra.gonzalez@example.com', 'claveDoctor2', '987654322', 'Calle Bienestar 456', 'Pediatría', 'femenino', '1980-06-25', '2024-01-06 00:00:00', NULL),
(4, 'Juan Pérez', 'juan.perez@example.com', 'clavePaciente1', '5551234', 'Calle Falsa 123', NULL, 'masculino', '1985-03-15', '2024-02-10 00:00:00', NULL),
(5, 'Ana Martínez', 'ana.martinez@example.com', 'clavePaciente2', '5555678', 'Calle Verdad 789', NULL, 'femenino', '1990-11-20', '2024-02-12 00:00:00', NULL),
(6, 'Dr. Carlos Fernández', 'dr.fernandez@example.com', 'claveDoctor3', '5556789', 'Calle Salud 789', 'Dermatología', 'masculino', '1982-07-15', '2024-01-10 00:00:00', NULL),
(7, 'Dra. Laura Méndez', 'dra.mendez@example.com', 'claveDoctor4', '5556780', 'Calle Bienestar 101', 'Ginecología', 'femenino', '1986-02-17', '2024-01-12 00:00:00', NULL),
(8, 'Carlos García', 'carlos.garcia@example.com', 'clavePaciente3', '5556781', 'Calle Verdad 234', NULL, 'masculino', '1995-08-08', '2024-02-15 00:00:00', NULL),
(9, 'Marta López', 'marta.lopez@example.com', 'clavePaciente4', '5556782', 'Calle Real 567', NULL, 'femenino', '1992-04-23', '2024-02-16 00:00:00', NULL),
(10, 'Sergio Ramírez', 'sergio.ramirez@example.com', 'clavePaciente5', '5556783', 'Calle Central 890', NULL, 'masculino', '1988-12-30', '2024-02-17 00:00:00', NULL),
(11, 'Admin Secundario', 'admin2@example.com', 'claveAdmin2', '5550000', 'Calle Administrativa 101', NULL, 'otros', '1982-09-19', '2024-01-20 00:00:00', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `turno_id` (`turno_id`);

--
-- Indexes for table `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `perfiles`
--
ALTER TABLE `perfiles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recetas`
--
ALTER TABLE `recetas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `historial_id` (`historial_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `doctor_id` (`doctor_id`,`paciente_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `historial`
--
ALTER TABLE `historial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `medicamentos`
--
ALTER TABLE `medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `perfiles`
--
ALTER TABLE `perfiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `recetas`
--
ALTER TABLE `recetas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
