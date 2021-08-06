const {getDB} = require('../../bbdd/db');

const validateUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { registrationCode } = req.params;

        // Comprobamos si hay algún usuario pendiente de validar con ese código.
        const [user] = await connection.query(
            `SELECT id, name, lastname FROM users WHERE registrationCode = ?;`,
            [registrationCode]
        );

        if (user.length < 1) {
            const error = new Error(
                'No hay usuarios pendientes de validar con este código'
            );
            error.httpStatus = 404;
            throw error;
        }

        // Activamos el usuario y eliminamos el código.
        await connection.query(
            `UPDATE users SET active = true, registrationCode = NULL WHERE registrationCode = ?;`,
            [registrationCode]
        );

        res.send({
            status: 'ok',
            message: 'Usuario verificado',
            name: user[0].name,
            lastname: user[0].lastname
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {validateUser};
