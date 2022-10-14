//importando arquivo .env
require('dotenv-safe').config();

//importando o modulo telegraf
const { Telegraf } = require('telegraf')

//importando o modulo api_nominatim(api_geo)
const api_geo = require("./api_nominatim");

//importando o modulo express, é um framework
const express = require("express");

//Metodo para criar rotas, no local host
const server = express();

//parametros
server.use(express.json());

//numero da porta 
server.listen(3000);

//testando se o servidor http://localhost:3000/ esta funcionando
server.get("/",(req, res) => {
    return res.send({message: "no ar"});
});

//criar rota localização com parametro ID(latitude e longitude) padrao lat=-22.3577&lon=-47.3849
server.get("/localizacao/:id",async (req, res) => {
    //armazenar os parametros digitados após localização/
    const { id } = req.params;
    try{
        //
        const {data} = await api_geo.get(`reverse?format=json&${id}`); //lat=-22.3577&lon=-47.3849
        //const {data} = await api_geo.get("reverse?format=json&format=json&lat=-22.3577&lon=-47.3849"); //format=json&lat=-22.3577&lon=-47.3849
        //criado somente para validar se data esta vazio
        var dados =data;
        //criando um objeto do telegraf com token da conta do telegram pra receber mensagem automatica
        const bot = new Telegraf(process.env.BOT_TOKEN);
        //Valida se data esta fazio
        if (dados =! null){
            //diferente de vazio, entao a variavel dados recebe a conversão em string do const data que esta como json, limitado somente para as infos do display_name
            dados = JSON.stringify(data,['display_name'])
            //utilizado para enviar mensagem(convertido em string) no telegram pelo bot e chat_id 
            bot.telegram.sendMessage(process.env.CHAT_ID, dados );
        }
        return res.send({data});
    } catch(error){
        res.send({error: error.message})
    }
    
})

