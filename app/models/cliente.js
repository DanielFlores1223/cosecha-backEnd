const moongose = require('mongoose');

const clienteSchema = moongose.Schema({
    nombreUsuario: {
        type: String,
        required: true
    },
    nombreRestaurante: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
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
    img: {
        type: String
    },
    publicidad: {
        type: Boolean
    },
    pedidos: [{
        idProductonombre: {
            type: String,
            required: true
        },
        idProveedornombre: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number
        },
        precioProducto: {
            type: Number
        },
        total: {
            type: Number
        },
        estatus: {
            type: String,
            default: 'Pendiente'
        }
    }],
    versionKey: false,
});

module.exports = moongose.model('cliente', clienteSchema)