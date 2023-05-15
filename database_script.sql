
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
	PRIMARY KEY(iddep),
	CONSTRAINT dep_no_void_name CHECK (LENGTH(nombre) > 0)
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
	FOREIGN KEY (iddep) REFERENCES departamentos,
	CONSTRAINT muni_no_void_name CHECK (LENGTH(nombre) > 0),
	CONSTRAINT muni_numH_positive CHECK (numH >= 0)
);


CREATE TABLE IF NOT EXISTS establecimientos(
	idest SERIAL,
	nombre VARCHAR(50) NOT NULL,
	direccion VARCHAR(200) NOT NULL,
	idmunicipio INT NOT NULL,
	PRIMARY KEY (idest),
	FOREIGN KEY (idmunicipio) REFERENCES municipios,
	CHECK (LENGTH(nombre) > 0 AND LENGTH(direccion) > 0)
);

CREATE TABLE IF NOT EXISTS mesas(
	idmesa SERIAL,
	nmesa INT NOT NULL,
	cotaSuperior INT NOT NULL,
	cotaInferior INT NOT NULL,
	idest INT NOT NULL,
	PRIMARY KEY (idmesa),
	FOREIGN KEY (idest) REFERENCES establecimientos,
	CHECK(cotaSuperior > cotaInferior),
	CHECK(cotaInferior >= 0),
	CHECK(nmesa > 0),
	UNIQUE (idest, nmesa) /* avoid repeated nmesa */
);

CREATE TABLE IF NOT EXISTS ciudadanos(
	nombres VARCHAR(100) NOT NULL,
	apellidos VARCHAR(100) NOT NULL,
	dpi VARCHAR(15) NOT NULL UNIQUE,
	idemp SERIAL,
	idmunicipio INT NOT NULL,
	direccion VARCHAR(250) NOT NULL,
	PRIMARY KEY (idemp),
	FOREIGN KEY (idmunicipio) REFERENCES municipios,
	CHECK (LENGTH(nombres) > 0 AND LENGTH(apellidos) > 0 AND LENGTH(dpi) > 0 AND LENGTH(direccion) > 0)
);

CREATE TABLE IF NOT EXISTS partidos(
	nombre VARCHAR(50) NOT NULL UNIQUE,
	acronimo VARCHAR(5) UNIQUE,
	logo VARCHAR(100) NOT NULL,
	idpartido SERIAL,
	idemp INT UNIQUE,
	PRIMARY KEY (idpartido),
	FOREIGN KEY (idemp) REFERENCES ciudadanos,
	CHECK ( nombre='nulo' OR nombre='blanco' OR idemp IS NOT NULL), /* Evitar idemp nulo  (nombre='nulo' OR nombre='blanco') OR idemp!=null */
	CHECK (LENGTH(nombre) > 0 AND LENGTH(acronimo) > 0)	
);

CREATE TABLE IF NOT EXISTS voluntarios(
	idemp SERIAL, /* avoid repeated ciudadanos */
	idmesa INT NOT NULL,
	tipo CHAR(1) NOT NULL,
	PRIMARY KEY (idemp),
	UNIQUE(idmesa, tipo), /* avoid repeated tipos de voluntarios */
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
	iddep INT,
	PRIMARY KEY (idemp), /* avoid repeated ciudadanos */
	UNIQUE (casilla, tipo, idpartido), /* avoid repeated casillas */
	FOREIGN KEY (idemp) REFERENCES ciudadanos,
	FOREIGN KEY (idpartido) REFERENCES partidos,
	FOREIGN KEY (tipo) REFERENCES tipos_candidatos,
	FOREIGN KEY (idmunicipio) REFERENCES municipios,
	FOREIGN KEY (iddep) REFERENCES departamentos,
	UNIQUE (idpartido, idmunicipio), /* avoid alcaldes for the same municipio */
	CHECK (tipo NOT IN ('D', 'N') OR casilla IS NOT NULL), /* force Diputados to have a casilla */
	CHECK (casilla IS NULL OR casilla > 0), /* only allow positive casillas */
	CHECK (tipo != 'A' OR idmunicipio IS NOT NULL), /* force Alcaldes to have a municipio */
	CHECK (tipo NOT IN ('D', 'N') OR iddep IS NOT NULL) /* force Diputados to have a departamento */
);

CREATE TABLE IF NOT EXISTS votos(
	idpartido SERIAL,
	idmesa INT NOT NULL,
	tipo VARCHAR(1) NOT NULL,
	cantidad INT,
	PRIMARY KEY (idpartido, idmesa, tipo),
	FOREIGN KEY (idpartido) REFERENCES partidos,
	FOREIGN KEY (idmesa) REFERENCES mesas,
	FOREIGN KEY (tipo) REFERENCES tipos_candidatos,
	CHECK(cantidad >= 0) /* only allow positive cantidad */
);

CREATE VIEW ubicacion_mesas AS (
SELECT M.nmesa, M.idmesa, M.cotaInferior, M.cotaSuperior, MM.idmunicipio FROM mesas M
	INNER JOIN establecimientos E ON M.idest = E.idest
	INNER JOIN municipios MM ON E.idmunicipio = MM.idmunicipio
);

/* test data */
INSERT INTO departamentos (nombre)
VALUES ('Guatemala'), ('Sacatepequez'), ('Quetzaltenango'), ('Chimaltenango'), ('Huehuetenango'), ('Baja Verapaz'), ('Alta Verapaz'), ('El Progreso'), ('Zacapa'), ('Izabal');

INSERT INTO tipos_candidatos (tipo)
VALUES ('P'), ('V'), ('A'), ('D'), ('N');

INSERT INTO municipios (nombre, numH, iddep)
VALUES ('Antigua Guatemala', 40, 1), ('Amatitlán', 100, 1), ('Escuintla', 200, 1), ('Mixco', 300, 1), ('Santa Catarina Pinula', 400, 1);

INSERT INTO establecimientos (nombre, direccion, idmunicipio)
VALUES ('Establishment 1', '123 Main Street', 1), ('Establishment 2', '456 Elm Street', 1), ('Establishment 3', '789 Oak Street', 1), ('Establishment 4', '101 Pine Street', 1);

INSERT INTO mesas (nmesa, cotaSuperior, cotaInferior, idest)
VALUES (1, 100, 0, 1), (2, 200, 100, 1), (3, 300, 200, 1), (4, 400, 300, 1);

INSERT INTO ciudadanos (nombres, apellidos, dpi, idmunicipio, direccion) VALUES
('Juan', 'Pérez', '1234567890123', 1, 'Calle 100, Zona 1'),
('María', 'López', '9876543210987', 2, 'Avenida 200, Zona 2'),
('Pedro', 'García', '8765432109876', 3, 'Calle 300, Zona 3'),
('Sofía', 'Rodríguez', '7654321098765', 4, 'Avenida 400, Zona 4'),
('Pablo', 'Gutiérrez', '6543210987654', 5, 'Calle 500, Zona 5'),
('Ana', 'Hernández', '5432109876543', 1, 'Avenida 600, Zona 1'),
('José', 'Méndez', '4321098765432', 2, 'Calle 700, Zona 2'),
('Isabel', 'Cáceres', '3210987654321', 3, 'Avenida 800, Zona 3'),
('Carlos', 'Sánchez', '2109876543210', 4, 'Calle 900, Zona 4'),
('Camila', 'Montero', '109876543210', 5, 'Avenida 1000, Zona 5'),
('Daniel', 'Ortiz', '98765432109', 1, 'Calle 1100, Zona 1'),
('Laura', 'Vásquez', '87654321098', 2, 'Avenida 1200, Zona 2'),
('Francisco', 'Romero', '76543210987', 3, 'Calle 1300, Zona 3'),
('Elena', 'Flores', '65432109876', 4, 'Avenida 1400, Zona 4'),
('Alejandro', 'Gutiérrez', '54321098765', 5, 'Calle 1500, Zona 5'),
('María José', 'Pérez', '43210987654', 1, 'Avenida 1600, Zona 1'),
('Luis', 'Hernández', '32109876543', 2, 'Calle 1700, Zona 2'),
('Martín', 'Méndez', '21098765432', 3, 'Avenida 1800, Zona 3'),
('Gabriela', 'Cáceres', '10987654321', 4, 'Calle 1900, Zona 4'),
('Diego', 'Sánchez', '9876543210', 5, 'Avenida 2000, Zona 5');

INSERT INTO voluntarios (idemp, idmesa, tipo)
VALUES (1, 1, 'P'), (2, 2, 'S'), (3, 3, 'V'), (4, 4, 'A');

INSERT INTO partidos(nombre, acronimo, logo, idpartido)
VALUES ('nulo', 'NULO', 'n', 100), ('blanco', 'BLA', 'b', 101);

SELECT * FROM partidos;
