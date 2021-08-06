const Amadeus = require('amadeus');
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const flightPrice = async (req, res, next) => {
    try {
        const data = req.body;

        const { result } = await amadeus.shopping.flightOffers.pricing.post(
            JSON.stringify(data)
        );

        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = flightPrice;
