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
        idProducto: {
            type: String,
        },
        idProveedor: {
            type: String,
        },
        cantidad: {
            type: Number
        },
        precioProducto: {
            type: Number
        },
        imgProducto: {
            type: String
        },
        total: {
            type: Number
        },
        estatus: {
            type: String,
            default: 'Pendiente'
        },
        fechaRegistro: {
            type: String
        },
        fechaUpdate: {
            type: String,
            default: ''
        },
        estrellas: {
            type: Number,
            default: 0
        }
    }],
    versionKey: false,
});

module.exports = moongose.model('cliente', clienteSchema)