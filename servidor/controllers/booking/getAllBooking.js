const { getDB } = require('../../bbdd/db');

const getAllBooking = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;
        console.log('idUser: ', idUser);

        const [booking] = await connection.query(
            `   
            SELECT S.id, B.bookingCode, B.createdAt, B.finalPrice, B.currency, I.itineraryId as 'Itinerario', I.duration, S.segmentId as 'Segmento', S.origin, S.destination, S.departure_datetime, S.arrival_datetime, S.carrierCode, S.duration
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

// const [booking] = await connection.query(
//     `
//     SELECT B.bookingCode, B.createdAt, B.oneWay, B.finalPrice, B.currency,
//     FROM booking B

//     WHERE B.idUser = ?

//     `,
//     [idUser]
// );
// console.log('booking: ', booking);
// const [itineraries] = await connection.query(
//     `
//     SELECT I.itineraryId as 'Itinerary Id'
//     FROM itineraries I
//     INNER JOIN booking B
//     ON B.id = I.idBooking

//     WHERE B.idUser = ?

//     `,
//     [idUser]
// );
// console.log('itineraries: ', itineraries);
// const [segments] = await connection.query(
//     `
//     SELECT  S.id as 'Segment Id', S.origin, S.destination, S.departure_datetime, S.arrival_datetime, S.carrierCode, S.duration
//     FROM segments S
//     INNER JOIN itineraries I
//     ON B.id = I.idBooking
//     INNER JOIN segments S
//     ON I.id = S.idItineraries
//     WHERE B.idUser = ?

//     `,
//     [idUser]
// );
// console.log('segments: ', segments);

// const bookingHistoryObject = [];
