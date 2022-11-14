//importando a conexão com o banco criado na /database/index.js
const mongoose = require("../database");

//criando o padrao de registro de log
const logSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    dispositivo: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: false,
    },
    longitude: {
        type: String,
        required: false,
    },
    data: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Log", logSchema);