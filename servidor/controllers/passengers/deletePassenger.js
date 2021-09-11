// **DELETE** - [/passengers/:idPassenger] - Borra un pasajero específico.

const getDB = require('../../bbdd/db');

const { formatDate } = require('../../helpers');

const deletePassenger = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const { idPassenger } = req.params;
        const { idBooking } = req.query;

        // Obtenemos el usuario relacionado con esta reserva:

        const idSearch = await connection.query(
            `SELECT idSearch FROM booking WHERE id = ?;`,
            [idBooking]
        );

        const idUser = await connection.query(
            `
        SELECT idUser FROM searches WHERE id = ?;`,
            [idSearch[0]]
        );

        /* // Comprobamos si no somos dueños de este usuario o el 'admin'.
        if (req.userAuth.idUser !== Number(idUser) &&
            req.userAuth.role !== 'admin') {
            const error = new Error(
                'No tienes permisos para editar este usuario'
            );
            error.httpStatus = 403;
            throw error;
        } */

        // Borramos al pasajero asociado a la reserva
        await connection.query(
            `
        DELETE FROM passengers WHERE id = ?;`,
            [idPassenger]
        );

        res.send({
            status: 'ok',
            message: 'El pasajero ha sido eliminado de esta reserva',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deletePassenger;
