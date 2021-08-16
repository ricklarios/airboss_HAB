const { getDB } = require('../../bbdd/db');
const { formatDate } = require('../../helpers');
const Amadeus = require('amadeus');
const { connect } = require('../../routes/auth');
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});
const iatacodes = require('../../iatacodes_v2.json');

const newSearch = async (req, res, next) => {
    let connection;
    try {
        const {
            currencyCode,
            oneWay,
            originLocationCode,
            destinationLocationCode,
            departureDate,
            returnDate,
            numAdults,
            numChilds,
            travelClass,
            crossBorderAllowed,
            maxFlightOffers,
            nonStop,
        } = req.query;

        // Creamos el array de origenes y destinos
        let originDestinations;
        //Solo ida
        if (oneWay === 'true') {
            if (
                !originLocationCode ||
                !destinationLocationCode ||
                !departureDate ||
                !numAdults ||
                !travelClass
            ) {
                const err = new Error('Complete todos los campos.');
                err.httpStatus = 400;
                throw err;
            }
            originDestinations = [
                {
                    id: '1',
                    originLocationCode: originLocationCode,
                    destinationLocationCode: destinationLocationCode,
                    destinationRadius: 50,
                    departureDateTimeRange: {
                        date: departureDate,
                    },
                },
            ];
        } else {
            //Ida y vuelta
            if (
                !originLocationCode ||
                !destinationLocationCode ||
                !departureDate ||
                !returnDate ||
                !numAdults ||
                !travelClass
            ) {
                const error = new Error('Complete todos los campos');
                error.httpStatus = 400;
                throw error;
            }

            originDestinations = [
                {
                    id: '1',
                    originLocationCode: originLocationCode,
                    destinationLocationCode: destinationLocationCode,
                    destinationRadius: 50,
                    departureDateTimeRange: {
                        date: departureDate,
                    },
                },
                {
                    id: '2',
                    originLocationCode: destinationLocationCode,
                    originRadius: 50,
                    destinationLocationCode: originLocationCode,
                    departureDateTimeRange: {
                        date: returnDate,
                    },
                },
            ];
        }
        const { idUser } = req.body;

        if (idUser !== undefined) {
            connection = await getDB();
            const now = new Date();
            await connection.query(
                `
                            INSERT INTO searches (searchDate, origin, destination, departureDate, currencyCode, idUser)
                            VALUES(?, ?, ?, ?, ?, ?);
                        `,
                [
                    formatDate(now),
                    originLocationCode,
                    destinationLocationCode,
                    departureDate,
                    currencyCode,
                    Number(idUser),
                ]
            );
        }

        //Creamos el array de travelers
        let travelers = [];
        let i = 1;
        if (numAdults > 0) {
            for (let j = 1; j <= numAdults; j++) {
                travelers.push({
                    id: i,
                    travelerType: 'ADULT',
                });
                i++;
            }
        }
        if (numChilds > 0) {
            for (let j = 1; j <= numChilds; j++) {
                travelers.push({
                    id: i,
                    travelerType: 'CHILD',
                });
                i++;
            }
        }

        //Creamos el objeto de criterios de Búsqueda
        let maxNumberOfConnections = 0;
        if (!nonStop || nonStop === 'false') {
            maxNumberOfConnections = 2;
        }
        const searchCriteria = {
            maxFlightOffers: Number(maxFlightOffers),
            flightFilters: {
                crossBorderAllowed: crossBorderAllowed,
                cabinRestrictions: [
                    {
                        cabin: travelClass,
                        originDestinationIds: ['1'],
                    },
                ],
                carrierRestrictions: {
                    blacklistedInEUAllowed: true,
                },
                connectionRestriction: {
                    maxNumberOfConnections: maxNumberOfConnections,
                },
            },
        };

        // Creamos el body para pasarle a amadeus
        const getFlightOffersBody = {
            currencyCode: currencyCode,
            originDestinations: originDestinations,
            travelers: travelers,
            sources: ['GDS'],
            searchCriteria: searchCriteria,
        };

        const jsonBody = JSON.stringify(getFlightOffersBody);

        let { result } = await amadeus.shopping.flightOffersSearch.post(
            jsonBody
        );
        //TESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
        //console.log(result);

        for (i = 0; i < result.data.length; i++) {
            //Bucle para recorrer los itinerarios
            for (j = 0; j < result.data[i].itineraries.length; j++) {
                //Bucle para recorrer los segmentos
                for (
                    k = 0;
                    k < result.data[i].itineraries[j].segments.length;
                    k++
                ) {
                    result.data[i].itineraries[j].segments[
                        k
                    ].departureCityName =
                        iatacodes[
                            result.data[i].itineraries[j].segments[k].departure
                                .iataCode
                        ] || '';
                    result.data[i].itineraries[j].segments[k].arrivalCityName =
                        iatacodes[
                            result.data[i].itineraries[j].segments[k].arrival
                                .iataCode
                        ] || '';
                }
            }
        }
        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.send({ status: 'error', data: error.message });
    } finally {
        if (connection) connection.release;
    }
};

module.exports = newSearch;
