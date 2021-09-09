const { getDB } = require('../../bbdd/db');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const fetch = require('node-fetch');
const { formatDate } = require('../../helpers');
const validateToken = async (req, res, next) => {
    // console.log('DENTRO DE VALIDATE TOKEN');
    let connection;
    connection = await getDB();
    const { typeAuth } = req.params;
    // console.log('DENTRO DE VALIDATE TOKEN');
    //FALTA ORGANIZAR MEJOR EL CODIGO, PROBABLEMENTE EN FUNCIONES EN HELPERS
    if (typeAuth === 'API') {
        try {
            const { authorization, iduser } = req.headers;
            if (!authorization) {
                const error = new Error('Falta la cabecera de autorización');
                error.httpStatus = 401;
                throw error;
            }
            if (!iduser) {
                const error = new Error('Id de usuario incorrecto');
                error.httpStatus = 401;
                throw error;
            }

            // Variable que almacenará la información del token.
            let tokenInfo;
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
            const [user] = await connection.query(
                `SELECT id, email, role, active, name, lastname, phoneNumber, nationality, createdAt, birthDate, avatar FROM users WHERE id = ?;`,
                [iduser]
            );
            // console.log(tokenInfo);
            const name = user[0].name;
            const lastname = user[0].lastname;
            const phoneNumber = user[0].phoneNumber;
            const nationality = user[0].nationality;
            const createdAt = user[0].createdAt;
            const birthDate = user[0].birthDate;
            const email = user[0].email;
            let avatar = user[0].avatar;
            //console.log(avatar);
            avatar
                ? (avatar = `http://localhost:3001/static/uploads/${avatar}`)
                : null;
            //console.log("AVATAR: ",avatar);
            res.send({
                status: 'ok',
                data: {
                    tokenInfo,
                    email,
                    iduser,
                    name,
                    lastname,
                    phoneNumber,
                    nationality,
                    createdAt,
                    birthDate,
                    avatar,
                },
            });
        } catch (error) {
            /* const error = new Error('El token no es válido');
            error.httpStatus = 401;
            throw error; */
            next(error);
        } finally {
            if (connection) connection.release();
        }
    } else if (typeAuth === 'google' && req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                const error = new Error(
                    'Falta la cabecera de autorización de Google'
                );
                error.httpStatus = 401;
                throw error;
            }
            let err = '';

            const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${authorization}`;

            const response = await fetch(url);
            const data = await response.json();
            console.log('data: ', data);
            if (data.error) {
                const error = new Error('Token de Google invalido');
                error.httpStatus = 401;
                throw error;
            }
            const [user] = await connection.query(
                `
                SELECT email, name, lastname, avatar, createdAt, phoneNumber, nationality, birthDate, id
                FROM users 
                WHERE email = ?
                `,
                [data.email]
            );
            console.log('user', user);
            if (user.length === 0) {
                // console.log('NO HAY USUARIO');
                await connection.query(
                    `
                    INSERT INTO users (email, name, lastname, createdAt, typeAuth, active, password) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        data.email,
                        data.given_name,
                        data.family_name,
                        formatDate(new Date()),
                        'google',
                        true,
                        'password',
                    ]
                );

                const [newUser] = await connection.query(
                    `SELECT id, email, role, active, name, lastname, phoneNumber, nationality, createdAt, birthDate, avatar, typeAuth FROM users WHERE email = ?`,
                    [data.email]
                );
                // console.log('newUser: ', newUser);
                // console.log(data);
                res.send({
                    status: 'ok',
                    data: {
                        message: 'Usuario autenticado',
                        email: data.email,
                        name: newUser[0].name,
                        lastname: newUser[0].lastname,
                        avatar: newUser[0].avatar || data.picture,
                        createdAt: newUser[0].createdAt,
                        phoneNumber: newUser[0].phoneNumber,
                        nationality: newUser[0].nationality,
                        birthday: newUser[0].birthDate,
                        idUser: newUser[0].id,
                    },
                });
                //console.log(user[0]);
            }
            // console.log(user);
            res.send({
                status: 'ok',
                data: {
                    message: 'Usuario autenticado',
                    email: data.email,
                    name: user[0].name,
                    lastname: user[0].lastname,
                    avatar: user[0].avatar || data.picture,
                    createdAt: user[0].createdAt,
                    phoneNumber: user[0].phoneNumber,
                    nationality: user[0].nationality,
                    birthday: user[0].birthDate,
                    idUser: user[0].id,
                },
            });
        } catch (error) {
            // console.log('DENTRO TRY GOOGLE BACK');
            // console.log(error);
            next(error);
        }
    } else if (typeAuth === 'fb' && req.headers.authorization) {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                const error = new Error('Falta la cabecera de autorización');
                error.httpStatus = 401;
                throw error;
            }
            let err = '';

            const url = `https://graph.facebook.com/me?access_token=${authorization}&fields=email,name,first_name,last_name,picture`;

            const response = await fetch(url);
            const data = await response.json();
            // console.log(data);
            if (data.error) {
                const error = new Error('Token de facebook invalido');
                error.httpStatus = 401;
                throw error;
            }
            const [user] = await connection.query(
                `SELECT id, email, role, active, name, lastname, phoneNumber, nationality, createdAt, birthDate, avatar, typeAuth FROM users WHERE email = ?`,
                [data.email]
            );
            // console.log(user);
            if (user.length === 0) {
                console.log('NO HAY USUARIO');
                await connection.query(
                    `INSERT INTO users (email, name, lastname, createdAt, typeAuth, active, password) VALUES (?, ?, ?, ?,?,?, ?)`,
                    [
                        data.email,
                        data.first_name,
                        data.last_name,
                        formatDate(new Date()),
                        'fb',
                        true,
                        'password',
                    ]
                );
                const [user] = await connection.query(
                    `SELECT id, email, role, active, name, lastname, phoneNumber, nationality, createdAt, birthDate, avatar, typeAuth FROM users WHERE email = ?`,
                    [data.email]
                );

                res.send({
                    status: 'ok',
                    data: {
                        message: 'Usuario autenticado',
                        email: data.email,
                        name: user[0].name,
                        lastname: user[0].lastname,
                        avatar: user[0].avatar || data.picture.data.url,
                        createdAt: user[0].createdAt,
                        phoneNumber: user[0].phoneNumber,
                        nationality: user[0].nationality,
                        birthday: user[0].birthDate,
                        idUser: user[0].id,
                    },
                });
                //console.log(user[0]);
            }

            res.send({
                status: 'ok',
                data: {
                    message: 'Usuario autenticado',
                    email: data.email,
                    name: user[0].name,
                    lastname: user[0].lastname,
                    avatar: user[0].avatar || data.picture.data.url,
                    createdAt: user[0].createdAt,
                    phoneNumber: user[0].phoneNumber,
                    nationality: user[0].nationality,
                    birthday: user[0].birthDate,
                    idUser: user[0].id,
                },
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = { validateToken };
