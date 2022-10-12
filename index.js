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
const api_geo = require("./api_nominatim");
const express = require("express");
const server = express();
server.use(express.json());
server.listen(8080);
server.get("/", (req, res) => {
    return res.send({ message: "no ar" });
});
server.get("/localizacao/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { data } = yield api_geo.get(`reverse?format=json&${id}`); //format=json&lat=-22.3577&lon=-47.3849
        return res.send({ data });
    }
    catch (error) {
        res.send({ error: error.message });
    }
}));
