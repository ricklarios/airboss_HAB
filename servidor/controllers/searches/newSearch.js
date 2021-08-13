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
                    destinationRadius: 250,
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
                    destinationRadius: 250,
                    departureDateTimeRange: {
                        date: departureDate,
                    },
                },
                {
                    id: '2',
                    originLocationCode: destinationLocationCode,
                    originRadius: 250,
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

        for (i=0; i<result.data.length; i++){
            // console.log(result.data[i].itineraries[0].segments[0].departure.iataCode);//.departure.iataCode);
            // console.log(result.data[i].itineraries[0].segments[result.data[i].itineraries[0].segments.length-1].arrival.iataCode);//.departure.iataCode);
            // console.log(i);
            result.data[i].itineraries[0].segments[0].departureCityName = iatacodes[result.data[i].itineraries[0].segments[0].departure.iataCode];
            result.data[i].itineraries[0].segments[0].arrivalCityName = iatacodes[result.data[i].itineraries[0].segments[result.data[i].itineraries[0].segments.length-1].arrival.iataCode];
            if (result.data[i].itineraries.length>1){
                result.data[i].itineraries[1].segments[0].departureCityName = iatacodes[result.data[i].itineraries[1].segments[0].departure.iataCode];
                result.data[i].itineraries[1].segments[0].arrivalCityName = iatacodes[result.data[i].itineraries[1].segments[result.data[i].itineraries[1].segments.length-1].arrival.iataCode];

            }
        }
        
        //const entry = iatacodes[originLocationCode];

        //console.log(entry[0].City, entry[0].Country);
        //result2 = {...result, cityDepartureName: entry[0].City};
        
        //TESTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
        
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
