const { id } = require('date-fns/locale');
const {getDB} = require('../../bbdd/db');
const { formatDate } = require('../../helpers');


const changeNL = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        //const { idUser } = req.params;
        const { active } = req.body;
    
        //console.log(active);
        
        // Comprobamos si no somos dueños de este usuario.
        /* if (req.userAuth.idUser !== Number(idUser)) {
            const error = new Error(
                'No tienes permisos para editar este usuario'
            );
            error.httpStatus = 403;
            throw error;
        } */

        // Obtenemos datos del usuario
        const [user] = await connection.query(
            `SELECT email FROM users WHERE id = ?`,
            [req.userAuth.idUser]
        );

        const [userNL] = await connection.query(
            `SELECT email, active FROM newsletterEmails WHERE email = ?`,
            [user[0].email]
        );
        
        // Fecha actual.
        const now = new Date();
        
        
        if (userNL.length<1){
            await connection.query(`
                INSERT INTO newsletterEmails (email, createdAt, active) VALUES (?,?,?)
            `,[user[0].email, formatDate(now), true ])
        }else{
            await connection.query(
                `UPDATE newsletterEmails SET active = ?, modifiedAt = ? WHERE email = ?`,
                [active, formatDate(now), user[0].email]
            );

        }
        
        
        res.send({
            status: 'ok',
            message: 'Cambio en Newsletter ejecutado',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {changeNL};
