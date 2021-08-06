const Amadeus = require('amadeus');
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const checkInLinks = async (req, res, next) => {
    try {
        const { airlineCode } = req.params;
        console.log(airlineCode);
        const { result } = await amadeus.referenceData.urls.checkinLinks.get({
            airlineCode: airlineCode,
        });
        res.send({
            status: 'ok',
            data: result.data,
        });
    } catch (error) {
        next();
    }
};

module.exports = checkInLinks;
