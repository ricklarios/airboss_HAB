const { id } = require('date-fns/locale');
const { getDB } = require('../../bbdd/db');
const { savePhoto, deletePhoto, formatDate } = require('../../helpers');

const editUser = async (req, res, next) => {
    console.log('ENTRO EN EDITUSER');
    let connection;
    try {
        connection = await getDB();

        //const { idUser } = req.params;
        const { element, newValue } = req.body;
        const { typeauth } = req.headers;

        //let idUserValidation;
        const getIdUser = (request) => {
            if (typeauth === 'google' || typeauth === 'fb') {
                return request.userauth.idUser;
            } else if (typeauth === 'API') {
                return request.params.idUser;
            }
        };

        // Si no llega ningún dato lanzamos un error.
        if (!element && !newValue) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }
        const idUser = getIdUser(req);

        // Obtenemos el email del usuario actual.
        const [user] = await connection.query(
            `SELECT email, avatar FROM users WHERE id = ?`,
            [idUser]
        );

        // Fecha actual.
        const now = new Date();

        await connection.query(
            `UPDATE users SET ${element} = ?, modifiedAt = ? WHERE id = ?`,
            [newValue, formatDate(now), idUser]
        );

        res.send({
            status: 'ok',
            message: 'Datos de usuario actualizados',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { editUser };
