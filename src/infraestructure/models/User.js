//importando a conexão com o banco criado na /database/index.js
const mongoose = require("../../interfaces/database/mongoose");

//criando o padrao de cadastro para usuários
const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dispositivo: {
        type: String,
        required: true,
        unique: true,
    },
    endereco: {
        type: String,
        required: true,
    },
    telefone: {
        type: String,
        required: true,
    },
    nome_contato: {
        type: String,
        required: true,
    },
    chatid1: {
        type: String,
        required: true,
    },
    telefone_contato: {
        type: String,
        required: true,
    },
    nome_contato2: {
        type: String,
        required: true,
    },
    telefone_contato2: {
        type: String,
        required: true,
    },
    chatid2: {
        type: String,
        required: true,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    }
});

//construindo o modelo utilizando o schema UserSchema
//const User = mongoose.model("User", UserSchema);

module.exports = mongoose.model("User", UserSchema);