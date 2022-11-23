require('dotenv-safe').config();
//importar o express para criar rota
const express = require("express");

//necessário para ler conteudo do body
const bodyParser = require('body-parser');

//necessário para criptografar senha
const bcrypt = require('bcrypt');

// utilizado para criar o token
const jwt = require('jsonwebtoken');

//utilizado para armazenar o tolken
const cookieparser = require('cookie-parser');

//importando o user
const User = require("../models/User");

//importando o empregado
const Employee = require("../models/Employee");

// para poder criar rotas
const router = express.Router();

//utilizado para validar se o token existe
const checkToken = require('../config/JWT')

//ler conteudo do body
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());


// registro de funcionarios
router.get('/employee', checkToken, (req, res) => {
    res.render('employee', { title: 'Registro novo funcinário' });
});

router.post('/employee', async(req, res) => {
    const { nome, email, password, confirmapassword } = req.body;

    if (password != confirmapassword) {
        return res.status(422).json({ msg: 'As senhas não conferem' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //criando funcionario
    const employee = new Employee({
        nome,
        email,
        password: passwordHash,
    });

    try {
        await employee.save();

        res.redirect("/auth/login");
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor' });
    }

});

//Login do funcionario

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email: email });

    if (!employee) {
        return res.status(404).json({ msg: 'Funcionário não encontrado!' });
    }

    //verifica senha
    const validapassword = await bcrypt.compare(password, employee.password)

    if (!validapassword) {
        return res.status(422).json({ msg: 'Senha inválida!' });
    }

    try {
        const secret = process.env.SECRET;

        const token = jwt.sign({
                id: employee._id,
            },
            secret,
        );

        res.cookie("access-token", token);
        console.log(token);
        res.redirect("/");

    } catch (err) {
        console.log(error);

        res.status(500).json({ msg: 'Erro no servidor' });
    }

});

//rota para criar novo cliente
router.get('/new', checkToken, (req, res) => {
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
        }
        res.redirect("/");
    });

});


//rota para atualizar cliente
router.get('/edit/:id', checkToken, (req, res) => {
    let id = req.params.id;
    User.findById(id, (err, user) => {
        if (err) {
            res.redirect("/");
        } else {
            res.render('edit_user', { title: 'Atualizar cadastro', user: user });
        }
    });
});

router.post('/update/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndUpdate(id, {
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
    }, (err, result) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            res.redirect("/");
        }

    });
});

//Excluir cliente
router.get("/delete/:id", checkToken, (req, res) => {
    let id = req.params.id;
    User.findByIdAndDelete(id, (err, result) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            res.redirect("/");
        }
    });
});

router.get('/logout', (req, res) => {
    res.cookie("access-token", " ", { maxAge: 1 });
    res.redirect('/auth/login');
});

module.exports = router;