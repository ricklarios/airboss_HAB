const { getDB } = require('../../bbdd/db');
const { formatDate, generateRandomString, sendMail } = require('../../helpers');

const requestNL = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const { email } = req.body;

        if (!email) {
            const error = new Error('Falta email');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            `SELECT email FROM newsletterEmails WHERE email = ?`,
            [email]
        );

        if (user.length > 0) {
            res.send({
                status: 'fallo',
                message: 'Email ya dado de alta previamente.',
            });
        }

        await connection.query(
            `INSERT INTO newsletterEmails (email, createdAt, active) VALUES (?, ?, ?);`,
            [email, formatDate(new Date()), true]
        );
        res.send({
            status: 'ok',
            message: 'Email dado de alta',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { requestNL };
