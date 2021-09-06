// **GET** - [/passengers/:idPassenger] - Devuelve un pasajero en específico.

const getDB = require('../../bbdd/db');

const { formatDate } = require('../../helpers');

const getPassenger = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idPassenger } = req.params;

        const [passenger] = await connection.query(
            `
        SELECT id, name, lastname, documentNumber, birthDate, createdAt, modifiedAt FROM passengers WHERE id = ?;`,
            [idPassenger]
        );

        console.log(passenger);
        const passengerInfo = {
            name: passenger[0].name,
            lastname: passenger[0].lastname,
            documentNumber: passenger[0].documentNumber,
            birthDate: passenger[0].birthDate,
            createdAt: passenger[0].createdAt,
            modifiedAt: passenger[0].modifiedAt,
        };

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

module.exports = getPassenger;
