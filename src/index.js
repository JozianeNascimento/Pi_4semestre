//importando arquivo .env
require('dotenv-safe').config();

const bodyParser = require('body-parser');

//importando o usermodel
const UserModel = require("./models/User");

//importando o modulo telegraf
const { Telegraf } = require('telegraf')

//importando o modulo api_nominatim(api_geo)
const api_geo = require("../api_nominatim");

//importando o modulo express, é um framework
const express = require("express");

//importando rota do controller
const AuthController = require("./controllers/AuthController");

//importando o modelo do usuário
const User = require('./models/User');

//Metodo para criar rotas, no local host
const server = express();

//parametros
server.set('view engine', 'ejs');
server.engine('ejs', require('ejs').__express);
server.use(express.json());
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(bodyParser.json());

//numero da porta 
server.listen(5000);

//testando se o servidor http://localhost:3000/ esta funcionando
server.get("/", (req, res) => {
    res.render('index', { title: 'Home Page' });
});

//rota da pagina sobre nós
server.get("/about", (req, res) => {
    res.render('about', { title: 'Sobre nós' });
});

//rota da pagina contatos
server.get("/contact", (req, res) => {
    res.render('contact', { title: 'Contate nos' });
});

//grupo de rota para cadastro de usuario
server.use("/auth", AuthController);

//criar rota localização com parametro ID(latitude e longitude) padrao lat=-22.3577&lon=-47.3849
server.get("/localizacao/:id", async(req, res) => {
    //  exemplo id = lat=-22.3577&lon=-47.3849

    //armazenar os parametros digitados após localização/
    const { id } = req.params;
    try {
        //utilizando a api com reverse para realizar o geolocalização reversa.
        const { data } = await api_geo.get(`reverse?format=json&${id}`); //lat=-22.3577&lon=-47.3849

        //criado somente para validar se data esta vazio e receber as informações de localização
        var dados = data;
        var lat;
        var lon;

        //criando um objeto do telegraf com token da conta do telegram pra receber mensagem automatica
        const bot = new Telegraf(process.env.BOT_TOKEN);

        //Valida se data esta vazio
        if (dados = !null) {

            //diferente de vazio, entao a variavel dados recebe a conversão em string do const data que esta como json, limitado somente para as infos do display_name
            // Json.stringfy converte objeto Json para string que vem da api nonimatim
            dados = JSON.stringify(data.display_name);
            lat = JSON.stringify(data.lat); //extraindo valor latitude e transformando em string
            lon = JSON.stringify(data.lon); //extraindo valor longitude e transformando em string

            //tratando as informações, removendo as aspas duplas
            lat = lat.replace('"', ""); //troca aspas para sem aspas
            lon = lon.replace('"', "");
            dados = dados.replace('"', "");

            //utilizado para enviar mensagem(convertido em string) no telegram pelo bot e chat_id 

            bot.telegram.sendMessage(process.env.CHAT_ID, "\u{1F616}\u{1F6A8} ALERTA \u{1F6A8}\u{1F6A8} Encaminhando localização: " + dados);
            // \u{1F6A8}\u{1F6A8} codigo de emotion https://apps.timwhitlock.info/emoji/tables/unicode
            //enviado os dado do mapa, posibilitando abrir pelo app google maps
            bot.telegram.sendLocation(process.env.CHAT_ID, lat, lon); //usado 3 parametros para a função chat id, lat e lon
        }
        return res.send("localização enviada com sucesso");
    } catch (error) {
        res.send({ error: error.message })
    }

})