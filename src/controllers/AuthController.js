//importar o express para criar rota
const express = require("express");

//necessário para ler conteudo do body
const bodyParser = require('body-parser');

//importando o user
const User = require("../models/User");

// para poder criar rotas
const router = express.Router();

//ler conteudo do body
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());


router.get('/new', (req, res) => {
    res.render('new', { title: 'Novo Cadastro' });
});

router.post('/new', (req, res) => {
    //criar registro no banco de dados
    const user = new User({
        nome: req.body.nome,
        email: req.body.email,
        dispositivo: req.body.dispositivo,
        endereco: req.body.endereco,
        telefone: req.body.telefone,
        nome_contato: req.body.nome_contato,
        telefone_contato: req.body.telefone_contato,
        chatid1: req.body.chatid1,
        nome_contato2: req.body.nome_contato2,
        telefone_contato2: req.body.telefone_contato2,
        chatid2: req.body.chatid2
    });
    user.save((err) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: "success",
                message: "Usuário cadastrado!"
            }
        }
        res.redirect("/");
    });

});

module.exports = router;