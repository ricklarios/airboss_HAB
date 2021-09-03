const { getDB } = require('../../bbdd/db');

const { savePhoto, formatDate } = require('../../helpers');

const changeAvatar = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const email = req.body.email;
        let photoName;
        if (req.files && req.files.avatar) {
            // Guardamos la foto en el servidor y obtenemos el nombre con el que la guardamos.
            avatarName = await savePhoto(req.files.avatar);
            // console.log('DENTRO DE IF');

            const now = new Date();
            // Guardamos la foto.
            await connection.query(
                `UPDATE users SET avatar = ?, modifiedAt = ? WHERE email = ?;`,
                [avatarName, formatDate(now), email]
            );
        }

        res.send({
            status: 'ok',
            data: {
                photo: photoName,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { changeAvatar };
