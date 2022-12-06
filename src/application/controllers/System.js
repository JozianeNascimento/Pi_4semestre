//importando arquivo .env
require('dotenv-safe').config();

const bodyParser = require('body-parser');

//importando o modulo express, é um framework
const express = require("express");

//importando rota do controller
const AuthController = require("./AuthController");

//importando o modelo do log
const Log = require('../../infraestructure/models/Log');

//Metodo para criar rotas, no local host
const server = express();

//importando o empregado
const Employee = require("../../infraestructure/models/Employee");

//base de cliente
const User = require('../../infraestructure/models/User');

// utilizado para criar o token
const jwt = require('jsonwebtoken');

//utilizado para armazenar o tolken
const cookieparser = require('cookie-parser');

//utilizado para validar se o token existe
const checkToken = require('../config/JWT')

//parametros
server.set('view engine', 'ejs');
server.engine('ejs', require('ejs').__express);
server.use(express.json());
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(bodyParser.json());
server.use(cookieparser());

server.get("/home", checkToken, (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('index', {
                title: 'Home Page',
                users: users,
            });
        }
    });
});

//rota privada
server.get("/employee/:id", checkToken, async(req, res) => {
    const id = req.params.id;

    const employee = await Employee.findById(id, '-password');

    if (!employee) {
        return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    res.status(200).json({ employee });

});

//rota da pagina sobre nós
server.get("/about", (req, res) => {
    res.render('about', { title: 'Sobre nós' });
});

//rota da pagina contatos
server.get("/log", checkToken, (req, res) => {
    Log.find().exec((err, log) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('log', {
                title: 'Relatório',
                log: log,
            });
        }
    });
});

module.exports = server;