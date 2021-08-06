const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
    try {
        
        const { authorization } = req.headers;
        if (!authorization) {
            const error = new Error('Falta la cabecera de autorización');
            error.httpStatus = 401;
            throw error;
        }

        // Variable que almacenará la información del token.
        let tokenInfo;

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
    } catch (error) {
        next(error);
    }
};

module.exports = {authUser};
