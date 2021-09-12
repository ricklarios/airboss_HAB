const { getDB } = require('../../bbdd/db');

const getUserById = async (req, res, next) => {
    let connection;
    try {
        connection = await getDB();

        const { idUser } = req.params;

        // Obtenemos el email del usuario actual.
        const [user] = await connection.query(
            `SELECT email, avatar, name, lastname, nationality, birthDate, createdAt FROM users WHERE id = ?`,
            [idUser]
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

module.exports = { getUserById };
