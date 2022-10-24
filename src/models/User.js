//importando a conexão com o banco criado na /database/index.js
const mongoose = require("../database");

//importando modulo para criptografar a senha
const bcryptjs = require("bcryptjs");

//criando o padrao de cadastro para usuários
const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
        select: false,
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
    criadoEm: {
        type: Date,
        default: Date.now,
    }
});

//antes de enviar o registo, será feito um pre-save para criptografar a senha
UserSchema.pre("save", async function(next) {
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;
})

//construindo o modelo utilizando o schema UserSchema
const User = mongoose.model("User", UserSchema);

module.exports = User;