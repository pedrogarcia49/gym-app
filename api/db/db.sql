CREATE DATABASE IF NOT EXISTS gimnasio;

use gimnasio;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT,
    DNI VARCHAR(8),
    nombre VARCHAR(32),
    apellido VARCHAR (32),
    PRIMARY KEY (id)
);

ALTER TABLE usuarios ADD COLUMN suscripcion VARCHAR(25);