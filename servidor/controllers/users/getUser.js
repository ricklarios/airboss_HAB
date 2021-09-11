const { getDB } = require('../../bbdd/db');

const getUser = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const { email } = req.body;
        console.log(req.body);

        // Obtenemos el email del usuario actual.
        const [user] = await connection.query(
            `SELECT id, avatar, name, lastname, nationality, birthDate, createdAt FROM users WHERE email = ?`,
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

module.exports = { getUser };
