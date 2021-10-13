const moongose = require('mongoose');
const cliente = require('../models/cliente');
const administrador = require('../models/administrador');
const proveedor = require('../models/proveedor');


exports.emailExistente = async(body) => {

    const { email } = body;

    let usuarioEncontrado = await cliente.findOne({ email });

    if (!usuarioEncontrado) {
        usuarioEncontrado = await proveedor.findOne({ email });

        if (!usuarioEncontrado) {
            usuarioEncontrado = await administrador.findOne({ email });

            if (usuarioEncontrado)
                return false;
            else
                return true;

        } else
            return false;

    } else
        return false;

}