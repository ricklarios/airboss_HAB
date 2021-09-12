const { getDB } = require('../../bbdd/db');

const getUserByEmail = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const { email } = req.params;

        // Obtenemos el email del usuario actual.
        const [user] = await connection.query(
            `SELECT id, avatar, name, lastname, nationality, birthDate, createdAt, email, phoneNumber  FROM users WHERE email = ?`,
            [email]
        );

        res.send({
            status: 'ok',
            data: user,
        });
    } catch (error) {
        console.log(error);
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { getUserByEmail };
