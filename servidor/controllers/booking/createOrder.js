const Amadeus = require('amadeus');
const { formatDate } = require('../../helpers');
const { getDB } = require('../../bbdd/db');
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const createOrder = async (req, res, next) => {
    let connection;
    try {
        const { flightObjet, travelers, idUser } = req.body;

        const { result } = await amadeus.booking.flightOrders.post(
            JSON.stringify({
                data: {
                    type: 'flight-order',
                    flightOffers: [flightObjet],
                    travelers: travelers,
                },
            })
        );

        connection = await getDB();

        //Extraigo el objeto data de result
        // que tiene la información que necesito.
        const { data } = result;

        //Insertamos la reserva
        //Guardo los datos que necesito para BD.
        const now = new Date();
        const bookingCode = data.id;
        const createdAt = formatDate(now);
        const finalPrice = data.flightOffers[0].price.total;
        const [newBooking] = await connection.query(
            `
                INSERT INTO booking (bookingCode, createdAt, finalPrice, idUser)
                VALUES(?, ?, ?, ?);
            `,
            [bookingCode, createdAt, finalPrice, idUser]
        );

        //Recupero el nuevo idBooking para pasarlo a passengers y a itinerarios
        const { insertId: idBooking } = newBooking;

        //Inserto pasajeros
        for (const traveler of travelers) {
            await connection.query(
                `
                    INSERT INTO passengers (name, lastname, passport, birthDate, gender, phoneContact, emailContact, idBooking )
                    VALUES(?, ?, ?, ?, ?, ? ,?, ?);
                `,
                [
                    traveler.name.firstName,
                    traveler.name.lastName,
                    traveler.documents[0].number,
                    traveler.dateOfBirth,
                    traveler.gender,
                    traveler.contact.phones[0].number,
                    traveler.contact.emailAddress,
                    idBooking,
                ]
            );
        }

        //Insertamos itinerarios
        //Me quedo con el array de itinerarios.
        const itineraries = data.flightOffers[0].itineraries;
        for (let i = 0; i < itineraries.length; i++) {
            const [newItinerarie] = await connection.query(
                `
                    INSERT INTO itineraries (duration, idBooking)
                    VALUES(?, ?);
                `,
                [itineraries[i].duration, idBooking]
            );
            //Guardo el idItinerario del bucle.
            const { insertId: idItinerarie } = newItinerarie;

            //Me quedo con el array de segmentos.
            const segments = itineraries[i].segments;
            for (const segment of segments) {
                await connection.query(
                    `
                        INSERT INTO segments (origin, destination, departure_datetime, arrival_datetime, carrierCode, duration, idItineraries)
                        VALUES(?, ?, ?, ?, ?, ?, ?);
                    `,
                    [
                        segment.departure.iataCode,
                        segment.arrival.iataCode,
                        segment.departure.at,
                        segment.arrival.at,
                        segment.carrierCode,
                        segment.duration,
                        idItinerarie,
                    ]
                );
            }
        }
        console.log('todo guay');
        res.send({
            satus: 'ok',
            data: result,
        });
    } catch (error) {
        console.log(error);
    } finally {
        if (connection) connection.release;
    }
};

module.exports = createOrder;
