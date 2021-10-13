const moongose = require('mongoose');
const model = require('../models/cliente');
const generalFunctions = require('./generalFunctions');
const multer = require('multer');
const fs = require('fs-extra');

let pathImg = '';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'img-cliente')
    },
    filename: function(req, file, cb) {
        pathImg = `/img-cliente/${Date.now()}-${file.originalname}`;
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });
exports.upload = upload.single('imagen');

const parseId = (id) => { return moongose.Types.ObjectId(id) };

exports.getData = async(req, res) => {
    await model.find({}, (err, data) => {

        if (err)
            return res.send(err);

        res.send(data);
    }).clone().catch(function(err) { console.log(err) });
}

exports.insert = async(req, res) => {
    const data = req.body;

    const emailExistente = await generalFunctions.emailExistente(data);

    if (!emailExistente) {
        res.send({ error: 'email existente' });
        return;
    }

    data.img = pathImg;

    await model.create(data, (err, data) => {
        if (err)
            res.status(422).send({ err: err });
        else
            res.status(200).send(data);
    });

    pathImg = '';
}

exports.deleteSingle = async(req, res) => {
    const { id } = req.params;

    const cliente = await model.findById({ _id: id });

    //Eliminamos la imagen
    if (cliente)
        await fs.unlink(`./${cliente.img}`);

    await model.deleteOne({ _id: parseId(id) },
        (err, data) => {
            res.send({
                data
            })
        }
    ).clone().catch(function(err) { console.log(err) });
}

exports.updateSingle = async(req, res) => {
    const { id } = req.params;
    const body = req.body;

    const emailExistente = await generalFunctions.emailExistente(body);

    if (!emailExistente) {
        res.send({ error: 'email existente' });
        return;
    }

    const modelMod = await model.findOneAndUpdate({ _id: parseId(id) },
        body, {
            new: true
        }
    );

    res.send(modelMod);
}

exports.updateSingleImg = async(req, res) => {
    const { id } = req.params;
    const body = req.body;

    const emailExistente = await generalFunctions.emailExistente(body);

    if (!emailExistente) {
        res.send({ error: 'email existente' });
        return;
    }

    const cliente = await model.findById({ _id: id });

    if (pathImg !== '') {
        await fs.unlink(`./${cliente.img}`);
        body.img = pathImg;
        pathImg = '';
    }

    const modelMod = await model.findOneAndUpdate({ _id: parseId(id) },
        body, {
            new: true
        }
    );

    res.send(modelMod);
}

// ** Pedidos **
exports.addPedido = async(req, res) => {
    const { id } = req.params;
    const data = req.body;
    data.total = Number(data.cantidad * data.precioProducto);

    //Obtener fecha
    const diaHoy = new Date();
    const fecha = diaHoy.getDate() + '/' + (diaHoy.getMonth() + 1) + '/' + diaHoy.getFullYear();

    data.fechaRegistro = fecha;

    const cliente = await model.findById({ _id: id });

    cliente.pedidos = cliente.pedidos.concat(data);

    await cliente.save();

    res.status(200).send(cliente);
}

exports.deletePedido = async(req, res) => {
    const { idCliente, idPedido } = req.params;

    let cliente = await model.findById(idCliente);

    cliente.pedidos = cliente.pedidos.pull({ _id: idPedido });

    await cliente.save();

    res.send(cliente).status(201);
}

async function queryUpdate(idCliente, idPedido, body) {
    const { cantidad, estatus, estrellas } = body;

    let cliente = await model.findById(idCliente);

    clienteObject = cliente.pedidos.find(p => p._id == idPedido);


    if (clienteObject.cantidad != cantidad) {
        const total = Number(cantidad * clienteObject.precioProducto);

        await model.findOneAndUpdate({ '$and': [{ '_id': parseId(idCliente) }, { 'pedidos._id': parseId(idPedido) }] }, {
            $set: {
                'pedidos.$.total': total,
            }
        }, {
            new: true
        });

    }

    const diaHoy = new Date();
    const fecha = diaHoy.getDate() + '/' + (diaHoy.getMonth() + 1) + '/' + diaHoy.getFullYear();


    const modelMod = await model.findOneAndUpdate({ '$and': [{ '_id': parseId(idCliente) }, { 'pedidos._id': parseId(idPedido) }] }, {
        $set: {
            'pedidos.$.cantidad': cantidad,
            'pedidos.$.estatus': estatus,
            'pedidos.$.fechaUpdate': fecha,
            'pedidos.$.estrellas': estrellas
        }
    }, {
        new: true
    });

    return modelMod;
}

exports.updateProducto = async(req, res) => {
    const { idCliente, idPedido } = req.params;
    const resQuery = await queryUpdate(idCliente, idPedido, req.body);
    res.send(resQuery);

}