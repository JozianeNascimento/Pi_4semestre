//importar o express para criar rota
const express = require("express");

//importando o usermodel
const UserModel = require("../models/User");

// para poder criar rotas
const router = express.Router();

router.post("/register", async(req, res) => {

    //croar registro no banco de dados
    const User = await UserModel.create(req.body);

    User.password = undefined;

    return res.json({
        error: false,
        message: "Resgistrado com sucesso!",
        data: User
    });
})

module.exports = router;