const { getDB } = require('../../bbdd/db');

const getAllBooking = async (req, res, next) => {
    let connection;
    // console.log('DENTRO DE GETALLBOOKING');
    try {
        connection = await getDB();

        const { idUser } = req.params;
        console.log('idUser: ', idUser);

        const [booking] = await connection.query(
            `   
            SELECT S.id, B.id, B.bookingCode, B.createdAt, B.finalPrice, B.currency, B.oneWay, I.itineraryId as 'Itinerario', I.duration, S.segmentId as 'Segmento', S.origin, S.destination, S.departure_datetime, S.arrival_datetime, S.carrierCode, S.duration
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

        const myHistoryObject = await historyObjectConstructor(booking);
        // console.log('historyObject: ', myHistoryObject);

        res.send({
            status: 'ok',
            data: myHistoryObject,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getAllBooking;

async function historyObjectConstructor(array) {
    const historyObject = [];
    for (let i = 0; i < array.length; i++) {
        const passengers = [];
        const idBooking = array[i].id
        passengers.push (await getPassengers(idBooking));
        //console.log(travelers);
        if (i === 0) {
            historyObject.push({
                id: i,
                bookingCode: array[i].bookingCode,
                createdAt: array[i].createdAt,
                finalPrice: array[i].finalPrice,
                currency: array[i].currency,
                oneWay: array[i].oneWay,
                itineraries: [
                    {
                        itineraryId: array[i].Itinerario,
                        segments: [
                            {
                                segmentId: array[i].Segmento,
                                origin: array[i].origin,
                                destination: array[i].destination,
                                departure_datetime: array[i].departure_datetime,
                                arrival_datetime: array[i].arrival_datetime,
                                carrierCode: array[i].carrierCode,
                            },
                        ],
                    },
                ],
                passengers,
            });
        } else if (
            i !== 0 &&
            array[i].bookingCode === array[i - 1].bookingCode
        ) {// 
            if (array[i].Itinerario === array[i - 1].Itinerario) {
                historyObject[historyObject.length - 1].itineraries[
                    array[i].Itinerario
                ].segments.push({
                    segmentId: array[i].Segmento,
                    origin: array[i].origin,
                    destination: array[i].destination,
                    departure_datetime: array[i].departure_datetime,
                    arrival_datetime: array[i].arrival_datetime,
                    carrierCode: array[i].carrierCode,
                });
            } else if (array[i].Itinerario !== array[i - 1].Itinerario) {
                historyObject[historyObject.length - 1].itineraries.push({
                    itineraryId: array[i].Itinerario,
                    segments: [
                        {
                            segmentId: array[i].Segmento,
                            origin: array[i].origin,
                            destination: array[i].destination,
                            departure_datetime: array[i].departure_datetime,
                            arrival_datetime: array[i].arrival_datetime,
                            carrierCode: array[i].carrierCode,
                        },
                    ],
                });
            }
        } else if (
            i !== 0 &&
            array[i].bookingCode !== array[i - 1].bookingCode
        ) {
            historyObject.push({
                id: historyObject.length,
                bookingCode: array[i].bookingCode,
                createdAt: array[i].createdAt,
                finalPrice: array[i].finalPrice,
                currency: array[i].currency,
                oneWay: array[i].oneWay,
                itineraries: [
                    {
                        itineraryId: array[i].Itinerario,
                        segments: [
                            {
                                segmentId: array[i].Segmento,
                                origin: array[i].origin,
                                destination: array[i].destination,
                                departure_datetime: array[i].departure_datetime,
                                arrival_datetime: array[i].arrival_datetime,
                                carrierCode: array[i].carrierCode,
                            },
                        ],
                    },
                ],
                passengers,
            });
        }
    }
    return historyObject;
}

async function getPassengers(idBooking){
    let connection;
    try {
        connection = await getDB();
        const [travelers] = await connection.query(`SELECT * FROM passengers WHERE idBooking = ?`,[idBooking]);
        //console.log(travelers);
        return travelers;
    } catch (error) {
        console.log(error);    
    }
    
}