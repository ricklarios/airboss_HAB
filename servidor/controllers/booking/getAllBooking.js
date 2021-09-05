const { getDB } = require('../../bbdd/db');

const getAllBooking = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;
        console.log('idUser: ', idUser);

        const [booking] = await connection.query(
            `   
            SELECT B.bookingCode, B.createdAt, B.finalPrice, I.id as 'Itinerario', I.duration, S.id as 'Segmento', S.origin, S.destination, S.departure_datetime, S.arrival_datetime, S.carrierCode, S.duration
            FROM booking B 
            INNER JOIN itineraries I
            ON B.id = I.idBooking
            INNER JOIN segments S
            ON I.id = S.idItineraries
            WHERE B.idUser = ?
            
            `,
            [idUser]
        );
        console.log('booking: ', booking);
        res.send({
            status: 'ok',
            data: booking,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getAllBooking;
