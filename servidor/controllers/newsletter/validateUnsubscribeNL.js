const {getDB} = require('../../bbdd/db');

const validateUnsubscribeNL = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { newsletterCode } = req.params;

        // Comprobamos si hay algún usuario pendiente de validar con ese código.
        const [mail] = await connection.query(
            `SELECT email, active FROM newsletterEmails WHERE newsletterCode = ?;`,
            [newsletterCode]
        );

        if (mail.length < 1) {
            const error = new Error(
                'No hay emails pendientes de validar con este código'
            );
            error.httpStatus = 404;
            throw error;
        }

        // Activamos el usuario y eliminamos el código.
        await connection.query(
            `UPDATE newsletterEmails SET active = false, newsletterCode = NULL WHERE newsletterCode = ?;`,
            [newsletterCode]
        );

        res.send({
            status: 'ok',
            message: 'Email dado de baja de la newsletter',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {validateUnsubscribeNL};
