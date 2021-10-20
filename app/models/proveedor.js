const moongose = require('mongoose');

const proveedorSchema = moongose.Schema({
    nombreUsuario: {
        type: String,
        required: true
    },
    nombreEmpresa: {
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
    estatus: {
        type: String,
        default: 'Activo'
    },
    rfc: {
        type: String,
        unique: true,
        required: true
    },
    domicilio: {
        type: String,
    },
    publicidad: {
        type: Boolean
    },
    img: {
        type: String,
    },
    estrellasTotal: {
        type: Number,
        default: -1
    },
    estrellasArray: [],
    productos: [{
        nombreProducto: {
            type: String
        },
        precio: {
            type: Number
        },
        tipo: {
            type: String
        },
        descuento: {
            type: Number
        },
        stock: {
            type: Number
        },
        img: {
            type: String
        },
        idProveedor: {
            type: String
        }
    }],
    versionKey: false,

});



module.exports = moongose.model('proveedor', proveedorSchema);