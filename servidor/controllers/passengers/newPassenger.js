const getDB = require('../../bbdd/db');

const { formatDate } = require('../../helpers');

const newPassenger = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idBooking } = req.query;

        const { name, lastname, documentNumber, birthDate } = req.body;

        const now = new Date();

        // Comprobamos si ya existe un pasajero en esa reserva con esos datos.
        const [passenger] = await connection.query(
            `SELECT id FROM passengers WHERE documentNumber= ? AND idBooking = ?;`,
            [documentNumber, idBooking]
        );

        if (passenger.length > 0) {
            const error = new Error(
                'Ya existe un pasajero con estos datos para esta reserva'
            );
            error.httpStatus = 409;
            throw error;
        }

        await connection.query(
            `INSERT INTO passengers (name, lastname, documentNumber, birthDate, idBooking, createdAt) VALUES (?, ?, ?, ?, ?, ?);`,
            [name, lastname, documentNumber, birthDate, idBooking, formatDate(now)]
        );

        res.send({
            status: 'ok',
            message: 'Pasajero introducido.',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newPassenger;
