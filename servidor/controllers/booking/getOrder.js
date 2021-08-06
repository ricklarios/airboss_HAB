const Amadeus = require('amadeus');
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const getOrder = async (req, res, next) => {
    try {
        const { idBooking } = req.params;
        const { result } = await amadeus.booking.flightOrder(idBooking).get();
        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = getOrder;
