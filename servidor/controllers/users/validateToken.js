const { getDB } = require('../../bbdd/db');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

const validateToken = async (req, res, next) => {
    let connection;
    connection = await getDB();
    const { typeAuth } = req.params;

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
            res.send({
                status: 'ok',
                data: {
                    tokenInfo,
                },
            });
        } catch (error) {
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

            const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${authorization}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                const error = new Error('Token de Google invalido');
                error.httpStatus = 401;
                throw error;
            }

            res.send({
                status: 'ok',
                data: {
                    message: 'Usuario autenticado',
                },
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
};

module.exports = { validateToken };
