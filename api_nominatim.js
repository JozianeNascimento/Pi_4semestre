// importando o modulo axios
const axios = require("axios");

const api_geo = axios.create({
    //aqui armazena a base url da api nominatim
    baseURL: "https://nominatim.openstreetmap.org/"
});
//criando o modulo api_geo
module.exports = api_geo;