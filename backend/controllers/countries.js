const Countries = require('../models/Country');


module.exports.allCountries = async (req, res) => {
    const countries = await Countries.find();
    if(countries) {
        res.status(200).json({
            countries: countries
        })
    } else {
        res.status(400).json({
            message: 'countries not found'
        })
    }
};
module.exports.addCountries = async (req, res) => {
    console.log(req.body.countries);

    const countries = await Countries.find();
    if(countries) {
        res.status(200).json({
            countries: countries
        })
    } else {
        res.status(400).json({
            message: 'countries not found'
        })
    }
}