const { getDB } = require('../../bbdd/db');
const jwt = require('jsonwebtoken');
const { googleVerify, formatDate } = require('../../helpers');

const loginUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            `SELECT id, role, active, name, lastname, phoneNumber, nationality, createdAt, birthDate, avatar FROM users WHERE email = ? AND password = SHA2(?, 512);`,
            [email, password]
        );

        // Si no existe el usuario...
        if (user.length < 1) {
            const error = new Error('Email o contraseña incorrectos');
            error.httpStatus = 401;
            throw error;
        }

        // Si existe pero no está activo...
        if (!user[0].active) {
            const error = new Error('Usuario pendiente de validar');
            error.httpStatus = 401;
            throw error;
        }

        // Creamos un objeto con información que le pasaremos al token.
        const tokenInfo = {
            idUser: user[0].id,
            role: user[0].role,
        };

        // Creamos el token.
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '7d',
        });

        const name = user[0].name;
        const lastname = user[0].lastname;
        const phoneNumber = user[0].phoneNumber;
        const nationality = user[0].nationality;
        const createdAt = user[0].createdAt;
        const birthDate = user[0].birthDate;
        const idUser = user[0].id;
        const avatar = user[0].avatar;
        // console.log(avatar);
        res.send({
            status: 'ok',
            data: {
                token,
                idUser,
                name,
                lastname,
                phoneNumber,
                nationality,
                createdAt,
                birthDate,
                avatar: `http://localhost:3001/static/uploads/${avatar}`, 
                idUser,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

const googleSignin = async (req, res) => {
    let connection;

    const { id_token } = req.body;
    try {
        connection = await getDB();
        const { name, picture, email } = await googleVerify(id_token);
        //Con esta consulta comprobamos si ya existe una cuenta con el correo del logado de Google
        let [user] = await connection.query(
            `SELECT * FROM users WHERE email = ?;`,
            [email]
        );
        //Si no existe en la BBDD procedemos a registrarlo
        if (user.length < 1) {
            await connection.query(
                `INSERT INTO users (email, name, password, createdAt, google, avatar, active) VALUES (?, ?, SHA2(?, 512), ?, ?,?,?);`,
                [email, name, ':P', formatDate(new Date()), true, picture, true]
            );
            [user] = await connection.query(
                `SELECT * FROM users WHERE email = ?;`,
                [email]
            );
        }

        if (!user[0].active) {
            return res.status(401).json({
                msg: 'El usuario no está activo, hable con el Admin',
            });
        }

        const tokenInfo = {
            idUser: user[0].id,
            role: user[0].role,
        };

        // Creamos el token.
        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '7d',
        });

        res.json({
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            msg: 'Token de Google no es válido',
        });
    }
};

module.exports = { loginUser, googleSignin };
