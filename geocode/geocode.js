const request = require('request');

var geocodeAddress = (address, callback) => {
    var encodedAddress = encodeURIComponent(address);

    request({
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=<GOOGLE-MAPS-API-KEY>`,
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Error connecting to google server');
        } else if (body.status === "ZERO_RESULTS") {
            callback('Unable to find the address');
        }
        else if (body.status === "OK") {
            callback(undefined, {
                address: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng
            });
        }
        else {
            callback('Something went wrong !!!!');
        }
    });
};

module.exports = {
    geocodeAddress
};