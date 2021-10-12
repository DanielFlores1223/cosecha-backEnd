const moongose = require('mongoose');
const model = require('../models/proveedor');
const multer = require('multer');
const fs = require('fs-extra');

let pathImg = '';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'img-proveedor')
    },
    filename: function(req, file, cb) {
        pathImg = `/img-proveedor/${Date.now()}-${file.originalname}`;
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

    const proveedor = await model.findById({ _id: id });

    //Eliminamos la imagen
    if (proveedor)
        await fs.unlink(`./${proveedor.img}`);

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

    const admin = await model.findById({ _id: id });

    if (pathImg !== '') {
        await fs.unlink(`./${admin.img}`);
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

// ** Productos array **
exports.addProducto = async(req, res) => {
    const { id } = req.params;
    const data = req.body;
    data.img = pathImg;

    const proveedor = await model.findById({ _id: id });

    proveedor.productos = proveedor.productos.concat(data);

    await proveedor.save();

    pathImg = '';
    res.status(200).send(proveedor);
}

async function deleteImgProducto(idProv, idProd) {

    let proveedor = await model.findById(idProv);

    let productoObject = proveedor.productos.find(p => p._id == idProd);

    if (proveedor) {
        await fs.unlink(`./${productoObject.img}`);
        return true;
    } else
        return false;
}

exports.deleteProducto = async(req, res) => {
    const { idProv, idProd } = req.params;

    const imgDeleted = await deleteImgProducto(idProv, idProd);

    if (!imgDeleted) {
        res.send({ error: 'ERROR!!!!' });
        return;
    }

    proveedor.productos = proveedor.productos.pull({ _id: idProd });

    await proveedor.save();

    res.send(proveedor).status(201);
}

async function queryUpdate(idProv, idProd, body) {
    const { nombreProducto, precio, tipo, descuento, stock } = body;

    const modelMod = await model.findOneAndUpdate({ '$and': [{ '_id': parseId(idProv) }, { 'productos._id': parseId(idProd) }] }, {
        $set: {
            'productos.$.nombreProducto': nombreProducto,
            'productos.$.precio': precio,
            'productos.$.tipo': tipo,
            'productos.$.descuento': descuento,
            'productos.$.stock': stock,
        }
    }, {
        new: true
    });

    return modelMod;
}

exports.updateProducto = async(req, res) => {
    const { idProv, idProd } = req.params;
    const resQuery = await queryUpdate(idProv, idProd, req.body);
    res.send(resQuery);

}

exports.updateProductoImg = async(req, res) => {
    const { idProv, idProd } = req.params;

    const imgDeleted = await deleteImgProducto(idProv, idProd);

    if (!imgDeleted) {
        res.send({ error: 'ERROR!!!!' });
        return;
    }

    await model.findOneAndUpdate({ '$and': [{ '_id': parseId(idProv) }, { 'productos._id': parseId(idProd) }] }, {
        $set: {
            'productos.$.img': pathImg
        }
    }, {
        new: true
    });

    pathImg = '';
    const resQuery = await queryUpdate(idProv, idProd, req.body);

    res.send(resQuery);

}