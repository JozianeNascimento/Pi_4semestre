"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//importando arquivo .env
require('dotenv-safe').config();
//importando o modulo telegraf
const { Telegraf } = require('telegraf');
//importando o modulo api_nominatim(api_geo)
const api_geo = require("./api_nominatim");
//importando o modulo express, é um framework
const express = require("express");
//Metodo para criar rotas, no local host
const server = express();
server.use(express.json());
server.listen(3000);
server.get("/", (req, res) => {
    return res.send({ message: "no ar" });
});
server.get("/localizacao/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { data } = yield api_geo.get(`reverse?format=json&${id}`); //lat=-22.3577&lon=-47.3849
        //const {data} = await api_geo.get("reverse?format=json&format=json&lat=-22.3577&lon=-47.3849"); //format=json&lat=-22.3577&lon=-47.3849
        var dados = data;
        const bot = new Telegraf(process.env.BOT_TOKEN);
        if (dados = !null) {
            dados = JSON.stringify(data, ['display_name']);
            bot.telegram.sendMessage(process.env.CHAT_ID, dados);
        }
        return res.send({ data });
    }
    catch (error) {
        res.send({ error: error.message });
    }
}));
