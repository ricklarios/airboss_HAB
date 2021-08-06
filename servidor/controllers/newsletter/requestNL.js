const {getDB} = require('../../bbdd/db');
const { formatDate,generateRandomString,sendMail } = require('../../helpers');

const requestNL = async (req, res, next)=> {
    let connection;

    try {
        connection = await getDB();
        const { email} = req.body;

        if (!email) {
            const error = new Error('Faltan email');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            `SELECT email FROM newsletterEmails WHERE email = ?`,
            [email]
        );

        if(user.length>0){
            const error = new Error('Email ya dado de alta previamente, para gestionar tu suscripción a la newsletter utiliza la opción de baja en el mail o bien en tu perfil de usuario');
            error.httpStatus = 401;
            throw error; 
        }
        const newsletterCode = generateRandomString(40);

        // Mensaje que enviaremos al usuario.
        const emailBody = `
            Has solicitado el alta en la Newsletter de airboss.
            Pulsa en este link para verificar tu correo: ${process.env.PUBLIC_HOST}/newsletter/validate/${newsletterCode}
        `;

        // Enviamos el mensaje.
        await sendMail({
            to: email,
            subject: 'Activa tu newsletter de airboss',
            body: emailBody,
        });
        
        await connection.query(
            `INSERT INTO newsletterEmails (email, createdAt, active, newsletterCode) VALUES (?, ?, ?,?);`,
            [email, formatDate(new Date()), false, newsletterCode]
        );
        res.send({
            status: 'ok',
            message: 'Email dado de alta, pendiente de validar.',
        });

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }

}

module.exports = {requestNL};