const Amadeus = require('amadeus');

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const cheapestDate = async (req, res, next) => {
    try {
        const { origin, destination } = req.query;
        const { result } = await amadeus.shopping.flightDates.get({
            origin,
            destination,
        });

        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = cheapestDate;
