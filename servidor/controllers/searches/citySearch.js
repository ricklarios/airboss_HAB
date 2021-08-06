const Amadeus = require('amadeus');
const { CLIENT_ID, CLIENT_SECRET } = process.env;
const amadeus = new Amadeus({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
});

const citySearch = async (req, res, next) => {
    try {
        const { keyword, view } = req.query;
        const { result } = await amadeus.referenceData.locations.get({
            keyword: keyword,
            subType: 'AIRPORT',
            view: view,
        });

        res.send({
            satus: 'ok',
            data: result,
        });
    } catch (error) {
        next();
    }
};

module.exports = citySearch;
