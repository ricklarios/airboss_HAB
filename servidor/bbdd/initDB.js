require('dotenv').config();
const faker = require('faker');
const { getDB } = require('./db');

const { formatDate } = require('../helpers');

let connection;

const main = async () => {
    try {
        connection = await getDB();

        // users, reservas, tickets, passengers
        await connection.query('DROP TABLE IF EXISTS users;');
        await connection.query('DROP TABLE IF EXISTS searches;');
        await connection.query('DROP TABLE IF EXISTS booking;');
        await connection.query('DROP TABLE IF EXISTS tickets;');
        await connection.query('DROP TABLE IF EXISTS passengers;');
        await connection.query('DROP TABLE IF EXISTS users_payment;');
        await connection.query('DROP TABLE IF EXISTS itineraries;');
        await connection.query('DROP TABLE IF EXISTS segments;');
        await connection.query('DROP TABLE IF EXISTS newsletterEmails;');

        //* Creamos la tabla de USERS:
        await connection.query(`
            CREATE TABLE users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(512) NOT NULL,
                name VARCHAR(50),
                lastname VARCHAR(50),
                avatar VARCHAR(50),
                phoneNumber VARCHAR(12),
                nationality VARCHAR(50),
                birthDate DATETIME,
                active BOOLEAN DEFAULT false,
                role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
                deleted BOOLEAN DEFAULT false,
                registrationCode VARCHAR(100),
                recoverCode VARCHAR(100),
                createdAt DATETIME NOT NULL, 
                modifiedAt DATETIME,
                google BOOLEAN DEFAULT false
                );
            `);
        console.log('Tabla USERS creada');

        await connection.query(`
            CREATE TABLE newsletterEmails (
                id INT PRIMARY KEY AUTO_INCREMENT,
                email VARCHAR(100) UNIQUE NOT NULL,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME,
                active BOOLEAN,
                newsletterCode VARCHAR(100)
                );
            `);
        console.log('Tabla newsletterEmails creada');

        //* Creamos la tabla de SEARCHES:
        await connection.query(`
         CREATE TABLE searches (
             id INT PRIMARY KEY AUTO_INCREMENT,
             searchDate DATETIME NOT NULL,
             origin VARCHAR(10) NOT NULL,
             destination VARCHAR(10) NOT NULL,
             departureDate DATE NOT NULL,
             currencyCode VARCHAR(10),
             idUser INT NOT NULL
             );
         `);

        console.log('Tabla SEARCHES creada');

        //* Creamos la tabla de BOOKING:
        await connection.query(`
            CREATE TABLE booking (
                id INT PRIMARY KEY AUTO_INCREMENT,
                bookingCode VARCHAR(100) UNIQUE NOT NULL,
                createdAt DATETIME NOT NULL, 
                finalPrice SMALLINT UNSIGNED NOT NULL,
                canceled BOOLEAN DEFAULT false,
                idUser INT NOT NULL
                );
            `);

        console.log('Tabla BOOKING creada');

        //* Creamos la tabla de PASSENGERS:
        await connection.query(`
        CREATE TABLE passengers (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50),
            lastname VARCHAR(50),
            passport VARCHAR(50) NOT NULL,
            birthDate DATETIME NOT NULL,
            gender ENUM('MALE', 'FEMALE', 'UNSPECIFIED', 'UNDISCLOSED'),
            phoneContact VARCHAR(25),
            emailContact VARCHAR(50),
            idBooking INT NOT NULL
            );
        `);

        console.log('Tabla PASSENGERS creada');

        //* Creamos la tabla de ITINERARIES:
        await connection.query(`
            CREATE TABLE itineraries (
                id INT PRIMARY KEY AUTO_INCREMENT,
                duration VARCHAR(10),
                idBooking INT NOT NULL             
                );   
            `);
        console.log('Tabla ITINERARIES creada');

        //* Creamos la tabla de SEGMENTS:
        await connection.query(`
            CREATE TABLE segments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                origin VARCHAR(10) NOT NULL,
                destination VARCHAR(10) NOT NULL,
                departure_datetime DATETIME NOT NULL,
                arrival_datetime DATETIME NOT NULL,
                carrierCode VARCHAR(10) NOT NULL,
                duration VARCHAR(10),
                idItineraries INT NOT NULL    
                );   
            `);
        console.log('Tabla SEGMENTS creada');

        console.log('Todas las tablas creadas correctamente!');

        // Nº de usuarios que vamos a introducir.
        const users = 10;

        // Insertamos los usuarios.
        for (let i = 0; i < users; i++) {
            // Fecha de creación.
            const now = formatDate(new Date());

            // Datos de faker.
            const email = faker.internet.email();
            const password = faker.internet.password();
            const name = faker.name.firstName();
            const lastname = faker.name.lastName();

            // Guardamos el usuario en la base de datos.
            await connection.query(`
                INSERT INTO users (email, password, name, lastname, active, createdAt)
                VALUES ("${email}", SHA2("${password}", 512), "${name}", "${lastname}", true, "${now}");
            `);
        }
    } catch (error) {
        console.error(error);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
};

main();
