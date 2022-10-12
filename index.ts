const api_geo = require("./api_nominatim");

const express = require("express");

const server = express();

server.use(express.json());

server.listen(8080);

server.get("/",(req, res) => {
    return res.send({message: "no ar"});
});

server.get("/localizacao/:id",async (req, res) => {
    const { id } = req.params;
    try{
        const {data} = await api_geo.get(`reverse?format=json&${id}`); //format=json&lat=-22.3577&lon=-47.3849

        return res.send({data});
    } catch(error){
        res.send({error: error.message})
    }
    
})
