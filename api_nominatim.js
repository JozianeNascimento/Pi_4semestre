const axios = require("axios");

const api_geo = axios.create({
    baseURL: "https://nominatim.openstreetmap.org/"
});

module.exports = api_geo;