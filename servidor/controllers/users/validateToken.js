const {getDB} = require('../../bbdd/db');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const fetch = require("node-fetch");

const validateToken = async (req, res, next) => {
    // console.log('DENTRO DE VALIDATE TOKEN');
    let connection;
    
    const { typeAuth } = req.params;
    // console.log(typeAuth);
    //FALTA ORGANIZAR MEJOR EL CODIGO, PROBABLEMENTE EN FUNCIONES EN HELPERS
    if (typeAuth==='API'){
        
        try {
            const { authorization, iduser } = req.headers;
            // console.log(req.headers);
            // console.log("IDUSER",iduser);
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
            connection = await getDB();
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
            avatar ? avatar=`http://localhost:3001/static/uploads/${avatar}` : null;
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
    }else if(typeAuth==='google'){
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                const error = new Error('Falta la cabecera de autorización');
                error.httpStatus = 401;
                throw error;
            }
            let err = ''
            
            const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${authorization}`;
            
            const response = await fetch(url);
            const data = await response.json();
            //console.log(data);
            if (data.error){
                const error = new Error("Token de Google invalido")
                error.httpStatus = 401;
                throw error
            }
            res.send({
                status: 'ok',
                data: {
                    message: "Usuario autenticado",
                    email: data.email,
                    name: data.given_name,
                    lastname: data.family_name,
                    avatar: data.picture
                },
            });
            // console.log('PASA DEL DATA.ERRO GOOGLE');
            
            
        } catch (error) {
                console.log('DENTRO TRY GOOGLE BACK');
            next(error)
        }
    }else if(typeAuth==='fb'){
        try {
            
            const { authorization } = req.headers;
            if (!authorization) {
                const error = new Error('Falta la cabecera de autorización');
                error.httpStatus = 401;
                throw error;
            }
            let err = ''

            const url = `https://graph.facebook.com/me?access_token=${authorization}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error){
                const error = new Error("Token de facebook invalido")
                error.httpStatus = 401;
                throw error
            }
            res.send({
                status: 'ok',
                data: {
                    message: "Usuario autenticado",
                },
            });
    
            
        } catch (error) {
            next(error)
        }
    }
};



module.exports = {validateToken};
