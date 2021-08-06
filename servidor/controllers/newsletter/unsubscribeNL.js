const {getDB} = require('../../bbdd/db');
const { formatDate,generateRandomString,sendMail } = require('../../helpers');

const unsubscribeNL = async (req, res, next)=> {
    let connection;

    try {
        connection = await getDB();
        const { email} = req.body;

        if (!email) {
            const error = new Error('Falta email');
            error.httpStatus = 400;
            throw error;
        }

        const [user] = await connection.query(
            `SELECT email FROM newsletterEmails WHERE email = ?`,
            [email]
        );

        if(user.length>0){
            const newsletterCode = generateRandomString(40);
            
            // Mensaje que enviaremos al usuario.
            const emailBody = `
                Has solicitado la baja en la Newsletter de airboss.
                Pulsa en este link para confirmar la baja: ${process.env.PUBLIC_HOST}/newsletter/unsubscribe/validate/${newsletterCode}
            `;
    
            // Enviamos el mensaje.
            await sendMail({
                to: email,
                subject: 'Confirma tu baja en la newsletter de airboss',
                body: emailBody,
            });
            await connection.query(
                `UPDATE newsletterEmails SET newsletterCode = ? WHERE email=?;`,
                [newsletterCode,email]
            );
            res.send({
                status: 'ok',
                message: 'Email con código de confirmación de baja en newsletter enviado'
            });


        }else{
            const error = new Error('Email no registrado para recibir newsletter de airboss');
            error.httpStatus = 401;
            throw error;
        }
        

    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }

}

module.exports = {unsubscribeNL};