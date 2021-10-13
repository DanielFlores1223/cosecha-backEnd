const moongose = require('mongoose');
const cliente = require('../models/cliente');
const administrador = require('../models/administrador');
const proveedor = require('../models/proveedor');


exports.login = async(req, res) => {

    const { email, password } = req.body;

    let usuarioEncontrado = await cliente.findOne({ '$and': [{ email }, { password }] });


    if (!usuarioEncontrado) {
        usuarioEncontrado = await proveedor.findOne({ '$and': [{ email }, { password }] });


        if (!usuarioEncontrado) {
            usuarioEncontrado = await administrador.findOne({ '$and': [{ email }, { password }] });

            if (usuarioEncontrado)
                res.send({ user: usuarioEncontrado, typeUser: 'administrador' });
            else
                res.send({ response: 'empty' });

        } else
            res.send({ user: usuarioEncontrado, typeUser: 'proveedor' });

    } else
        res.send({ user: usuarioEncontrado, typeUser: 'cliente' });


}