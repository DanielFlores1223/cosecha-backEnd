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
        unique: true,
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
        }
    }],
    versionKey: false,

});



module.exports = moongose.model('proveedor', proveedorSchema);