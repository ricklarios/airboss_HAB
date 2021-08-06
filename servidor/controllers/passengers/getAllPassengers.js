const getDB = require('../../bbdd/db');

const getAllPassengers = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idBooking } = req.query;

        // Obtenemos la info y los pasajeros de un idBooking en concreto
        const [passengers] = await connection.query(
            `SELECT id, name, lastname, passport, birthDate, createdAt, modifiedAt FROM passengers WHERE idBooking = ?;`,
            [idBooking]
        );
        //console.log(passengers);
        // Creamos un array vacío y pusheamos la info de cada pasajero
        let passengerInfo = [];
        for (const passenger of passengers) {
            const fragInfo = {
                name: passenger.name,
                lastname: passenger.lastname,
                passport: passenger.passport,
                birthDate: passenger.birthDate,
                createdAt: passenger.createdAt,
                modifiedAt: passenger.modifiedAt,
            };
            passengerInfo.push(fragInfo);
        }

        res.send({
            status: 'ok',
            data: passengerInfo,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getAllPassengers;
