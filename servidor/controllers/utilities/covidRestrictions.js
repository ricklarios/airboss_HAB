const Amadeus = require('amadeus');

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const covidRestrictions = async (req, res, next) => {
    try {
        const { countryCode, cityCode } = req.body;

        const { result } = await amadeus.client.get(
            '/v1/duty-of-care/diseases/covid19-area-report',
            { countryCode: countryCode, cityCode: cityCode }
        );

        res.send({
            status: 'ok',
            data: result,
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = covidRestrictions;
