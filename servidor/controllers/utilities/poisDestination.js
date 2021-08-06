const Amadeus = require('amadeus');

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const poisDestination = async (req, res, next) => {
    try {
        const { latitude, longitude } = req.query;
        const { result } = await amadeus.client.get(
            '/v1/reference-data/locations/pois',
            { latitude: latitude, longitude: longitude }
        );

        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = poisDestination;
