const { id } = require('date-fns/locale');
const {getDB} = require('../../bbdd/db');
const { savePhoto, deletePhoto, formatDate } = require('../../helpers');


const editUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;
        const { name, lastname, email } = req.body;
        //const {avatar}= req.files;
        //console.log(avatar);
        console.log(name, lastname, email);
        //console.log(req.body);
        // Comprobamos si no somos dueños de este usuario.
        if (req.userAuth.idUser !== Number(idUser)) {
            const error = new Error(
                'No tienes permisos para editar este usuario'
            );
            error.httpStatus = 403;
            throw error;
        }
        // Si no llega ningún dato lanzamos un error.
        if (!name && !email && !lastname && !(req.files && req.files.avatar)) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        // Obtenemos el email del usuario actual.
        const [user] = await connection.query(
            `SELECT email, avatar FROM users WHERE id = ?`,
            [idUser]
        );

        // Fecha actual.
        const now = new Date();

        /**
         * ############
         * ## Avatar ##
         * ############
         *
         * Comprobamos si el usuario quiere insertar un nuevo avatar.
         *
         */
        if (req.files && req.files.avatar) {
            // Comprobamos si el usuario ya tiene un avatar previo.
            // De ser así eliminamos el avatar del disco.
            if (user[0].avatar) {
                await deletePhoto(user[0].avatar);
            }

            // Guardamos la foto en disco y obtenemos el nombre con el
            // cuál la guardamos.
            const avatarName = await savePhoto(req.files.avatar);

            // Guardamos el avatar en la base de datos.
            await connection.query(
                `UPDATE users SET avatar = ?, modifiedAt = ? WHERE id = ?;`,
                [avatarName, formatDate(now), idUser]
            );
        }

        /**
         * ###########
         * ## Email ##
         * ###########
         *
         * En caso de que haya email, comprobamos si es distinto al existente.
         *
         */
        if (email && email !== user[0].email) {
            // Comrpobamos que el nuevo email no este repetido.
            const [existingEmail] = await connection.query(
                `SELECT id FROM users WHERE email = ?;`,
                [email]
            );

            if (existingEmail.length > 0) {
                const error = new Error(
                    'Ya existe un usuario con el email proporcionado en la base de datos'
                );
                error.httpStatus = 409;
                throw error;
            }

            // Si hemos llegado hasta aquí procederemos a actualizar el email del usuario.
            await connection.query(
                `UPDATE users SET email = ?, modifiedAt = ? WHERE id = ?`,
                [email, formatDate(now), idUser]
            );
        }

        /**
         * ##########
         * ## Name ##
         * ##########
         *
         * En caso de que haya nombre, comprobamos si es distinto al existente.
         *
         */
        if (name && user[0].name !== name) {
            await connection.query(
                `UPDATE users SET name = ?, modifiedAt = ? WHERE id = ?`,
                [name, formatDate(now), idUser]
            );
        }
         /**
         * ##########
         * ## lastname ##
         * ##########
         *
         * En caso de que haya nombre, comprobamos si es distinto al existente.
         *
         */
          if (lastname && user[0].lastname !== lastname) {
            await connection.query(
                `UPDATE users SET lastname = ?, modifiedAt = ? WHERE id = ?`,
                [lastname, formatDate(now), idUser]
            );
        }

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

module.exports = {editUser};
