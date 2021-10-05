const moongose = require('mongoose');

const AdministradorSchema = new moongose.Schema({
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
    timestamps: true
});

module.exports = mongoose.model('administrador', AdministradorSchema);