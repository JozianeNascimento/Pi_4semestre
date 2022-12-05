//importando o modelo do log
const Log = require('../../infraestructure/models/Log');

const bodyParser = require('body-parser');

//importando o modulo telegraf
const { Telegraf } = require('telegraf')

//importando o modulo api_nominatim(api_geo)
const api_geo = require("../Api_Nominatim");

//importando o modulo express, é um framework
const express = require("express");

//Metodo para criar rotas, no local host
const server = express();

//base de cliente
const User = require('../../infraestructure/models/User');

//parametros
server.set('view engine', 'ejs');
server.engine('ejs', require('ejs').__express);
server.use(express.json());
server.use(bodyParser.urlencoded({
    extended: false
}));
server.use(bodyParser.json());

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
                var chatid2 = resultado[0].chatid2;
                bot.telegram.sendMessage(chatid2, "\u{1F6A8}\u{1F6A8} ALERTA \u{1F6A8}\u{1F6A8} Encaminhando localização: " + dados);
                bot.telegram.sendLocation(chatid2, lat, lon);
            });
        }
        return res.send("localização enviada com sucesso - mensagem teste");
    } catch (error) {
        res.send({ error: error.message });
    }

});

module.exports = server;