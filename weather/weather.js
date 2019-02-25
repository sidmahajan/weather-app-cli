const request = require('request');

var getWeather = (latitude, longitude, callback) => {
    var lat = latitude;
    var lng = longitude;

    request({
        url: `https://api.darksky.net/forecast/<DARKSKY-API-KEY>/${lat},${lng}?units=si`,
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            callback(undefined, {
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        } else {
            callback('Unable to fetch weather')
        }
    });
};

module.exports.getWeather = getWeather;