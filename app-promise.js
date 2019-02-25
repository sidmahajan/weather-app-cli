const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .option({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch the weather for',
            string: true,
            default: 'orbit apartment zirakpur'
        },
        d: {
            demand: false,
            alias: 'detail',
            describe: 'Detailed Weather',
            string: true,
            choices: ['yes', 'no']
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

var encodedAddress = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=<GOOGLE-MAPS-API-KEY>`;

axios.get(geocodeUrl)
    .then((response) => {
        if (response.data.status === "ZERO_RESULTS") {
            throw new Error('Invalid address');
        }

        console.log(response.data.results[0].formatted_address);

        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;;
        var weatherUrl = `https://api.darksky.net/forecast/<DARKSKY-API-KEY>/${lat},${lng}?units=si`;

        return axios.get(weatherUrl);
    }).then((response) => {
        var temperature = response.data.currently.temperature;
        var apparentTemperature = response.data.currently.apparentTemperature;
        var weeklyPrediction = response.data.daily.summary;
        var currentSummary = response.data.currently.summary;
        var humidity = response.data.currently.humidity;

        if (argv.d === 'yes') {
            console.log(`It's curently: ${temperature} and ${currentSummary}`);
            console.log(`With a humidity of ${humidity * 100}%`)
            console.log(`The weekly prediction is ${weeklyPrediction}`);
        } else {
            console.log(`It's curently: ${temperature}`);
            console.log(`Feels like: ${apparentTemperature}`);
        }
    })
    .catch((e) => {
        if (e.code === 'ENOTFOUND') {
            console.log('Unable to connect to API Servers');
        } else {
            console.log(e.message);
        }
    });