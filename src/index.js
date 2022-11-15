//importando arquivo .env
require('dotenv-safe').config();

const bodyParser = require('body-parser');

//importando o modulo telegraf
const { Telegraf } = require('telegraf')

//importando o modulo api_nominatim(api_geo)
const api_geo = require("../api_nominatim");

//importando o modulo express, é um framework
const express = require("express");

//importando rota do controller
const AuthController = require("./controllers/AuthController");

//importando o modelo do log
const Log = require('./models/Log');

//Metodo para criar rotas, no local host
const server = express();

//base de cliente
const User = require('./models/User');

//parametros
server.set('view engine', 'ejs');
server.engine('ejs', require('ejs').__express);
server.use(express.json());
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(bodyParser.json());

//numero da porta 
server.listen(3000);

//testando se o servidor http://localhost:3000/ esta funcionando
server.get("/", (req, res) => {
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

//rota da pagina sobre nós
server.get("/about", (req, res) => {
    res.render('about', { title: 'Sobre nós' });
});

//rota da pagina contatos
server.get("/log", (req, res) => {
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


//grupo de rota para cadastro/alteração e exclusão de usuario
server.use("/auth", AuthController);

//criar rota localização com parametro ID(dispositivo, latitude e longitude) padrao lat=-22.3577&lon=-47.3849
server.get("/localizacao/:id", async(req, res) => {
    //armazenar os parametros digitados após localização/
    const { id } = req.params;
    //dividindo os paramentros em numero do dispositivo e lat/lon
    const device = id.substring(0, 4);
    const aux = id.substring(4);

    try {
        //utilizando a api com reverse para realizar o geolocalização reversa.
        const { data } = await api_geo.get(`reverse?format=json&${aux}`); //lat=-22.3577&lon=-47.3849

        //ciado variaveis para receber as informações da api de geolocalização.
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

            const users = "users";
            var query = { dispositivo: device }; // variavel para receber a condição do dispositivo enviado por api
            //utilizado o find para buscar as info do cadastro de usuário
            User.find(query).exec((erro, resultado) => {
                if (erro) throw erro;
                //variavel criada para armazenar o nome do usuário
                var name = resultado[0].nome;
                // instaciado um novo objeto do tipo log para receber as variaveis definidas
                const log = new Log({
                    nome: name,
                    dispositivo: device,
                    latitude: lat,
                    longitude: lon,
                });
                //salvar no mongodb
                log.save();
                //variavel que recebe o chatid dos contatos do cliente para enviar as mensagens com a localização
                var chatid = resultado[0].chatid1;
                //utilizado para enviar mensagem(convertido em string) no telegram pelo bot e chat_id 
                bot.telegram.sendMessage(chatid, "\u{1F6A8}\u{1F6A8} ALERTA \u{1F6A8}\u{1F6A8} Encaminhando localização: " + dados);
                // \u{1F6A8}\u{1F6A8} codigo de emotion https://apps.timwhitlock.info/emoji/tables/unicode
                //enviado os dado do mapa, posibilitando abrir pelo app google maps
                bot.telegram.sendLocation(chatid, lat, lon); //usado 3 parametros para a função chat id, lat e lon

            });
        }
        return res.send("localização enviada com sucesso - mensagem teste");
    } catch (error) {
        res.send({ error: error.message });
    }

});