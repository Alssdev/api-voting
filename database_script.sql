

-- Drop all tables
DROP TABLE IF EXISTS votos CASCADE;
DROP TABLE IF EXISTS candidatos CASCADE;
DROP TABLE IF EXISTS voluntarios CASCADE;
DROP TABLE IF EXISTS partidos CASCADE;
DROP TABLE IF EXISTS ciudadanos CASCADE;
DROP TABLE IF EXISTS mesas CASCADE;
DROP TABLE IF EXISTS establecimientos CASCADE;
DROP TABLE IF EXISTS municipios CASCADE;
DROP TABLE IF EXISTS tipos_candidatos CASCADE;
DROP TABLE IF EXISTS departamentos CASCADE;



/* official schema */
CREATE TABLE IF NOT EXISTS departamentos(
	nombre VARCHAR(30) NOT NULL,
	iddep SERIAL,
	PRIMARY KEY(iddep)
);

CREATE TABLE  tipos_candidatos(
	tipo VARCHAR(1),
	PRIMARY KEY (tipo),
	CHECK (tipo IN ('P', 'V', 'A', 'D', 'N'))
);

CREATE TABLE IF NOT EXISTS municipios(
	nombre VARCHAR(50) NOT NULL,
	idmunicipio SERIAL,
	numH INT NOT NULL,
	iddep SERIAL,
	PRIMARY KEY (idmunicipio),
	FOREIGN KEY (iddep) REFERENCES departamentos
);


CREATE TABLE IF NOT EXISTS establecimientos(
	idest SERIAL,
	nombre VARCHAR(50) NOT NULL,
	direccion VARCHAR(200) NOT NULL,
	idmunicipio INT NOT NULL,
	PRIMARY KEY (idest),
	FOREIGN KEY (idmunicipio) REFERENCES municipios
);

CREATE TABLE IF NOT EXISTS mesas(
	nmesa INT NOT NULL,
	cotaSuperior INT NOT NULL,
	cotaInferior INT NOT NULL,
	idest SERIAL,
	idmesa SERIAL,
	PRIMARY KEY (idmesa),
	FOREIGN KEY (idest) REFERENCES establecimientos,
	CHECK(cotaSuperior >  cotaInferior)
);

CREATE TABLE IF NOT EXISTS ciudadanos(
	nombres VARCHAR(100) NOT NULL,
	apellidos VARCHAR(100) NOT NULL,
	dpi VARCHAR(15) NOT NULL UNIQUE,
	idemp SERIAL,
	idmunicipio INT NOT NULL,
	direccion VARCHAR(250) NOT NULL,
	PRIMARY KEY (idemp),
	FOREIGN KEY (idmunicipio) REFERENCES municipios
);

CREATE TABLE IF NOT EXISTS partidos(
	nombre VARCHAR(50) NOT NULL,
	acronimo VARCHAR(5),
	logo VARCHAR(50) NOT NULL,
	idpartido SERIAL,
	idemp INT,
	PRIMARY KEY (idpartido),
	FOREIGN KEY (idemp) REFERENCES ciudadanos,
	CHECK ( nombre='nulo' OR nombre='blanco' OR idemp IS NOT NULL) /* Evitar idemp nulo  (nombre='nulo' OR nombre='blanco') OR idemp!=null */
);

CREATE TABLE IF NOT EXISTS voluntarios(
	idemp SERIAL,
	idmesa INT NOT NULL,
	tipo CHAR(1) NOT NULL,
	PRIMARY KEY (idemp),
	UNIQUE(idmesa,idemp),
	FOREIGN KEY (idemp) REFERENCES ciudadanos,
	FOREIGN KEY (idmesa) REFERENCES mesas,
	CHECK (tipo IN ('P', 'S', 'V', 'A'))
);

CREATE TABLE IF NOT EXISTS candidatos(
	idemp SERIAL,
	idpartido SERIAL,
	casilla INT,
	tipo VARCHAR(1) NOT NULL,
	idmunicipio INT,
	iddep SERIAL,
	PRIMARY KEY (idemp),
	UNIQUE (casilla, tipo, idpartido),
	FOREIGN KEY (idemp) REFERENCES ciudadanos,
	FOREIGN KEY (idpartido) REFERENCES partidos,
	FOREIGN KEY (tipo) REFERENCES tipos_candidatos,
	FOREIGN KEY (idmunicipio) REFERENCES municipios,
	FOREIGN KEY (iddep) REFERENCES departamentos
);

CREATE TABLE IF NOT EXISTS votos(
	idpartido SERIAL,
	idmesa INT,
	tipo VARCHAR(1),
	cantidad INT,
	PRIMARY KEY (idpartido, idmesa, tipo),
	FOREIGN KEY (idpartido) REFERENCES partidos,
	FOREIGN KEY (idmesa) REFERENCES mesas,
	FOREIGN KEY (tipo) REFERENCES tipos_candidatos
);
CREATE VIEW ubicacion_mesas AS
	(SELECT M.nmesa,M.idmesa,M.cotainferior,M.cotasuperior,MM.idmunicipio
	FROM mesas M
	INNER JOIN establecimientos E ON M.idest = E.idest
	INNER JOIN municipios MM ON E.idmunicipio = MM.idmunicipio);

/* test data */
INSERT INTO departamentos (nombre)
VALUES  ('Guatemala'),
		('Sacatepequez'),
		('Quetzaltenango'),
		('Chimaltenango'),
		('Huehuetenango'),
		('Baja Verapaz'),
		('Alta Verapaz'),
		('El Progreso'),
		('Zacapa'),
		('Izabal'),
		('Quiché'),
		('Chiquimula'),
		('Jutiapa'),
		('Sololá');


INSERT INTO tipos_candidatos (tipo)
VALUES  ('P'),
		('V'),
		('A'),
		('D'),
		('N');


INSERT INTO municipios (nombre,numH,iddep)
VALUES  ('Antigua Guatemala', 40, 1),
		('Amatitlán', 100, 1),
		('Escuintla', 200, 1),
		('Mixco', 300, 1),
		('Santa Catarina Pinula', 400, 1),
		('Santa Cruz del Quiché', 500, 1),
		('San Pedro Jocopilas', 250, 1),
		('San Juan Ermita', 150, 1),
		('Jocotán', 400, 2),
		('Camotán', 200, 2),
		('San José La Arada', 100, 2),
		('Comapa', 350, 3),
		('El Adelanto', 200, 3),
		('Atescatempa', 100, 3),
		('Panajachel', 300, 4),
		('Sololá', 200, 4),
		('San Juan La Laguna', 100, 4),
		('San Andrés Itzapa', 350, 5),
		('Chimaltenango', 200, 5),
		('Patzún', 100, 5);


INSERT INTO establecimientos (nombre, direccion, idmunicipio)
VALUES  ('Establishment 1', '123 Main Street', 1),
		('Establishment 2', '456 Elm Street', 1),
		('Establishment 3', '789 Oak Street', 1),
		('Establishment 4', '101 Pine Street', 1),
		('Colegio María Auxiliadora', '5a. Calle 3-12 Zona 2', 1),
		('Colegio Salesiano Don Bosco', '2a. Calle 2-52 Zona 2', 1),
		('Instituto Nacional de Educación Básica', '4a. Calle 1-42 Zona 1', 2),
		('Instituto Técnico en Computación', '6a. Calle 5-42 Zona 3', 2),
		('Escuela Oficial Rural Mixta', '1a. Calle 1-11 Zona 3', 3),
		('Colegio Francisco Marroquín', '7a. Avenida 1-10 Zona 10', 3);


INSERT INTO mesas (nmesa, cotaSuperior, cotaInferior, idest)
VALUES  (1, 100, 0, 1),
		(2, 200, 100, 1),
		(3, 300, 200, 1),
		(4, 400, 300, 1),
		(1, 100, 0, 1),
		(2, 200, 100, 1),
		(3, 300, 200, 1),
		(4, 100, 0, 2),
		(5, 200, 100, 2),
		(6, 300, 200, 2),
		(7, 100, 0, 3),
		(8, 200, 100, 3),
		(9, 300, 200, 3),
		(10, 100, 0, 4),
		(11, 200, 100, 4),
		(12, 300, 200, 4);


INSERT INTO ciudadanos (nombres, apellidos, dpi, idmunicipio, direccion)
VALUES  ('Juan', 'Rodríguez', '10123', 1, '123 Main Street'),
		('María', 'López', '9810987', 1, '456 Elm Street'),
		('Pedro', 'García', '765409876', 1, '789 Oak Street'),
		('Susana', 'Pérez', '543254', 1, '101 Pine Street'),
		('Juan', 'Pérez', '1234101', 1, 'Calle 1, Zona 2'),
		('María', ' Martínez', '23451102', 2, 'Avenida 2, Zona 1'),
		('Pedro', 'García', '311013', 3, 'Calle 3, Zona 3'),
		('Ana', 'Gómez', '4567', 1, 'Calle 4, Zona 2'),
		('Luis', 'González', '56785', 2, 'Avenida 5, Zona 1'),
		('Eva', 'Hernández', '6786', 3, 'Calle 6, Zona 3'),
		('Jorge', 'Sánchez', '789', 1, 'Calle 7, Zona 2'),
		('Lucía', 'López', '89018', 2, 'Avenida 8, Zona 1'),
		('Miguel', 'Castro', '9013469', 3, 'Calle 9, Zona 3'),
		('Pilar', 'Díaz', '011610', 1, 'Calle 10, Zona 2'),
		('Juan', 'Pérez', '1234567890123', 1, '123 Main Street'),
		('María', 'López', '9876543210987', 1, '456 Elm Street'),
		('Pedro', 'García', '765432109876', 1, '789 Oak Street'),
		('Susana', 'Rodríguez', '543210987654', 1, '101 Pine Street'),
		('Juan', 'Pérez', '1234567890101', 1, 'Calle 1, Zona 2'),
		('María', 'Gómez', '2345678901102', 2, 'Avenida 2, Zona 1'),
		('Pedro', 'García', '3456789011013', 3, 'Calle 3, Zona 3'),
		('Ana', 'Martínez', '4567890110124', 1, 'Calle 4, Zona 2'),
		('Luis', 'González', '567890110125', 2, 'Avenida 5, Zona 1'),
		('Eva', 'Hernández', '678901101236', 3, 'Calle 6, Zona 3'),
		('Jorge', 'López', '789011012347', 1, 'Calle 7, Zona 2'),
		('Lucía', 'Sánchez', '89011012358', 2, 'Avenida 8, Zona 1'),
		('Miguel', 'Castro', '90110123469', 3, 'Calle 9, Zona 3'),
		('Pilar', 'Díaz', '011012345610', 1, 'Calle 10, Zona 2');


INSERT INTO partidos (nombre, acronimo, logo, idemp)
VALUES  ('Partido Patriota', 'PP', 'logo.png', 1),
		('Partido de Avanzada Nacional', 'PAN', 'logo.png', 2),
		('Partido Unionista', 'PU', 'logo.png', 3),
		('Partido Democratico', 'PD', 'logo.png', 4),
		('Partido de Avanzada Nacional', 'PAN', 'logo.png', 5),
		('Partido Socialista Guatemalteco', 'PSG', 'logo.png', 6),
		('Partido Renovación por Guate', 'PRG', 'logo.png', 7),
		('Winaq', 'W', 'logo.png', 8),
		('Movimiento para la Liberación de los Pueblos', 'MLP', 'logo.png', 9),
		('Movimiento Nueva República', 'MNR', 'logo.png', 10),
		('Compromiso, Renovación y Orden', 'CREO', 'logo.png', 11),
		('Partido Unionista', 'PU', 'logo.png', 12),
		('Victoria', 'VICT', 'logo.png', 13),
		('Todos', 'TODOS', 'logo.png', 14);
		


INSERT INTO voluntarios (idemp, idmesa, tipo)
VALUES  (1, 1, 'P'),
		(2, 2, 'S'),
		(3, 3, 'V'),
		(4, 4, 'A'),
		(5, 3, 'P'),
		(6, 3, 'V'),
		(7, 4, 'S'),
		(8, 4, 'A'),
		(9, 5, 'P'),
		(10, 5, 'V'),
		(11, 6, 'S'),
		(12, 6, 'A'),
		(13, 7, 'P'),
		(14, 7, 'V');


INSERT INTO candidatos (idemp, idpartido, casilla, tipo, idmunicipio, iddep)
VALUES  (1, 1, 1, 'P', 1, 1),
		(2, 1, 2, 'V', 1, 1),
		(3, 1, 3, 'A', 1, 1),
		(4, 1, 4, 'D', 1, 1),
		(5, 2, 1, 'P', 1, 1),
		(6, 2, 2, 'V', 1, 1),
		(7, 2, 3, 'A', 1, 1),
		(8, 2, 4, 'D', 1, 1),
		(9, 3, 1, 'P', 1, 1),
		(10, 3, 2, 'V', 1, 1),
		(11, 3, 3, 'A', 1, 1),
		(12, 3, 4, 'D', 1, 1);


INSERT INTO partidos(nombre, acronimo, logo, idpartido)
VALUES 	('nulo', 'NULO', 'n', 100),
		('blanco', 'BLA', 'b', 101);



SELECT P.nombre, V.cantidad from votos V, Partidos P WHERE P.idpartido = V.idpartido AND V.idmesa = 1 AND V.tipo ='P'























