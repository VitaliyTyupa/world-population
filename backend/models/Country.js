const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema({
    alpha3Code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    capital: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        default: ''
    },
    region: {
        type: String,
        default: ''
    },
    subregion: {
        type: String,
        default: ''
    },
    regionalBlocs: [
        {
            acronym: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            }
        }
    ],
    borders: [
        {
            type: String,
            default: ''
        }
    ],
    languages: [
        {
            cod: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    ],
    translations: {
        de: {
            type: String,
            required: true
        },
        fr: {
            type: String,
            required: true
        },
        ua: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('countries', countrySchema);