const mongoose = require("../../interfaces/database/mongoose");

const EmployeeSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    criadoEm: {
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model("Employee", EmployeeSchema);