//requisitando o pacote mongoose para conversar com o banco mongodb
const mongoose = require("mongoose");

// conectando ao banco, criando a base de dados chamado api_meu_local
mongoose.connect("mongodb://localhost:27017/api_meu_local", {}, (error) => {
    if (error) {
        console.log('Falha ao autenticar com mongodb');
        console.log(error);
        return;
    }

    console.log('Conexão com mongodb estável');
})

//configuração padrao quando trabalhamos com mongodb e nodejs
mongoose.Promise = global.Promise;

module.exports = mongoose;