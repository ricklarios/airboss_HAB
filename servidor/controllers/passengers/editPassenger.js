// **PUT** - [/passengers/:idPassenger] - Edita un pasajero específico.

const getDB = require('../../bbdd/db');

const { formatDate } = require('../../helpers');

const editPassenger = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idBooking } = req.query;
        const { idPassenger } = req.params;

        const { name, lastname, passport, birthDate } = req.body;

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

        /* // Comprobamos si no somos dueños de este usuario.
        if (req.userAuth.idUser !== Number(idUser)) {
            const error = new Error(
                'No tienes permisos para editar este usuario'
            );
            error.httpStatus = 403;
            throw error;
        } */

        // Si no llega ningún dato lanzamos un error.
        if (!name && !lastname && !passport && !birthDate) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Obtenemos los datos del pasajero.
        const [passenger] = await connection.query(
            `SELECT name, lastname, passport, birthDate FROM passengers WHERE id = ?`,
            [idPassenger]
        );

        const now = new Date();

        // En caso de que haya NOMBRE, comprobamos si es distinto al existente.
        if (name && passenger[0].name !== name) {
            await connection.query(
                `UPDATE passengers SET name = ?, modifiedAt = ? WHERE id = ?`,
                [name, formatDate(now), idPassenger]
            );
        }

        // En caso de que haya APELLIDOS, comprobamos si son distintos al existente.
        if (lastname && passenger[0].lastname !== lastname) {
            await connection.query(
                `UPDATE passengers SET lastname = ?, modifiedAt = ? WHERE id = ?`,
                [lastname, formatDate(now), idPassenger]
            );
        }

        // En caso de que haya PASSPORT, comprobamos si es distinto al existente.
        if (passport && passenger[0].passport !== passport) {
            await connection.query(
                `UPDATE passengers SET passport = ?, modifiedAt = ? WHERE id = ?`,
                [passport, formatDate(now), idPassenger]
            );
        }

        // En caso de que haya FECHA_NACIMIENTO, comprobamos si es distinta al existente.
        if (birthDate && passenger[0].birthDate !== birthDate) {
            await connection.query(
                `UPDATE passengers SET birthDate = ?, modifiedAt = ? WHERE id = ?`,
                [birthDate, formatDate(now), idPassenger]
            );
        }

        res.send({
            status: 'ok',
            message: 'Datos de pasajero actualizados',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editPassenger;
