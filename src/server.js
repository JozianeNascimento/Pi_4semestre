//importando arquivo .env
require('dotenv-safe').config();

const bodyParser = require('body-parser');

//importando o modulo express, é um framework
const express = require("express");

//importando rota do controller
const AuthController = require("./application/controllers/AuthController");

//rota da api
const Api = require("./application/controllers/Api_Interna");

//rota do site
const System = require("./application/controllers/System");

//Metodo para criar rotas, no local host
const server = express();

//utilizado para armazenar o tolken
const cookieparser = require('cookie-parser');

//parametros
server.set('view engine', 'ejs');
server.engine('ejs', require('ejs').__express);
server.use(express.json());
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(bodyParser.json());
server.use(cookieparser());

//grupo de rota para cadastro/alteração e exclusão de usuario
server.use("/auth", AuthController);

//grupo de rota para api interna
server.use("/api", Api);

//grupo de rota para o sistema
server.use("/system", System);

//tela default
server.get('/', (req, res) => {
    res.send({ message: 'Bem vindo' });
});

module.exports = server;