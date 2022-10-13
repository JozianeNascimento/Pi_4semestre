require('dotenv-safe').config();

const { Telegraf } = require('telegraf')
 
const api_geo = require("./api_nominatim");

const express = require("express");

const server = express();

server.use(express.json());

server.listen(3000);

server.get("/",(req, res) => {
    return res.send({message: "no ar"});
});

server.get("/localizacao/:id",async (req, res) => {
    const { id } = req.params;
    try{
        const {data} = await api_geo.get(`reverse?format=json&${id}`); //lat=-22.3577&lon=-47.3849
        //const {data} = await api_geo.get("reverse?format=json&format=json&lat=-22.3577&lon=-47.3849"); //format=json&lat=-22.3577&lon=-47.3849
        var dados =data;
        const bot = new Telegraf(process.env.BOT_TOKEN);
        if (dados =! null){
            dados = JSON.stringify(data,['display_name'])
            bot.telegram.sendMessage(process.env.CHAT_ID, dados );
        }
        return res.send({data});
    } catch(error){
        res.send({error: error.message})
    }
    
})

