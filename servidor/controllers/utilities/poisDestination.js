const Amadeus = require('amadeus');

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const poisDestination = async (req, res, next) => {
    try {
        const { south, west, north, east } = req.query;
        const { result } = await amadeus.client.get(
            '/v1//shopping/activities/by-square',
            { south: south, west: west, north: north, east: east }
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
