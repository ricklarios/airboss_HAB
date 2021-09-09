const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { getDB } = require('../bbdd/db');

const authUser = async (req, res, next) => {
    let connection;
    
    try {
        connection = await getDB();
        const { authorization, typeauth } = req.headers;
        console.log(req.headers);
        if (!authorization) {
            const error = new Error('Falta la cabecera de autorización');
            error.httpStatus = 401;
            throw error;
        }
        
        if (typeauth === 'google') {
            const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${authorization}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.error) {
                    const error = new Error('Token de Google invalido');
                    error.httpStatus = 401;
                    throw error;
                } else {
                    const [user] = await connection.query(
                        `SELECT id, email, role, active, name, lastname, phoneNumber, nationality, createdAt, birthDate, avatar, typeAuth FROM users WHERE email = ?;`,
                        [data.email]
                        );
                        req.userauth = { idUser: user[0].id };
                        return next();
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            if (typeauth === 'fb') {
                const url = `https://graph.facebook.com/me?access_token=${authorization}&fields=email,name,first_name,last_name,picture`;
                console.log('DENTRO DE FB');
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    
                    if (data.error) {
                        const error = new Error('Token de facebook invalido');
                        error.httpStatus = 401;
                        throw error;
                    } else {
                        const [user] = await connection.query(
                            `SELECT id, email, role, active, name, lastname, phoneNumber, nationality, createdAt, birthDate, avatar, typeAuth FROM users WHERE email = ?;`,
                            [data.email]
                            );
                            //console.log('authUser 55', user);
                            req.userauth = { idUser: user[0].id };
                            return next();
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            if (typeauth === 'API') {
                // Variable que almacenará la información del token.
                let tokenInfo;
                // console.log('ENTRO');
                try {
                    tokenInfo = jwt.verify(authorization, process.env.SECRET);
            } catch (err) {
                const error = new Error('El token no es válido');
                error.httpStatus = 401;
                throw error;
            }

            // Inyectamos en la request la información del token (idUser, role).
            req.userAuth = tokenInfo;
            next();
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { authUser };
