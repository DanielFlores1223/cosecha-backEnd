const mongoose = require('mongoose');

const AdministradorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    versionKey: false,
});

module.exports = mongoose.model('administrador', AdministradorSchema);