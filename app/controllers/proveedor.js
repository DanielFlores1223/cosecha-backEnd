const moongose = require('mongoose');
const model = require('../models/proveedor');
const generalFunctions = require('./generalFunctions');
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

exports.getDataSingle = async(req, res) => {
    const { _id } = req.params;

    const proveedor = await model.findById({ _id });

    res.send(proveedor).status(201);
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

function updateEstrellas(body) {

    if (body.estrellasTotal != undefined || body.estrellasTotal != -1) {
        let array = []

        for (let index = 0; index < body.estrellasTotal; index++) {
            console.log(index)
            array[index] = index;
        }

        return array;
    }
}

exports.updateSingle = async(req, res) => {
    const { id } = req.params;
    const body = req.body;

    const emailExistente = await generalFunctions.emailExistente(body);

    if (!emailExistente) {
        res.send({ error: 'email existente' });
        return;
    }

    const arrayEstrellas = updateEstrellas(req.body);
    body.estrellasArray = arrayEstrellas;

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

    const admin = await model.findById({ _id: id });

    if (pathImg !== '') {
        await fs.unlink(`./${admin.img}`);
        body.img = pathImg;
        pathImg = '';
    }


    const arrayEstrellas = updateEstrellas(req.body);
    body.estrellasArray = arrayEstrellas;

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

exports.searchProductoProveedor = async(req, res) => {
    const { busqueda } = req.body;
    let arrayProductos = [];

    if (busqueda == '') {
        res.status(201).send({ proveedor: [], productos: [] });
        return;
    }

    const resultadoProveedores = await model.find({ '$or': [{ nombreUsuario: { '$regex': busqueda, '$options': 'i' } }, { nombreEmpresa: { '$regex': busqueda, '$options': 'i' } }] });

    const resultadoProductos = await model.find({ 'productos.nombreProducto': { '$regex': busqueda, '$options': 'i' } });

    if (resultadoProductos.length > 0) {

        resultadoProductos.filter(p => p.productos.nombreProducto == busqueda);

        resultadoProductos.forEach(proveedor => {

            //Devolvemos solo los productos que corresponden al valor de la variable busqueda
            proveedor.productos.forEach(producto => {

                const nombreProducto = String(producto.nombreProducto).toLowerCase();
                const busquedaSet = String(busqueda).toLowerCase();

                if (nombreProducto.includes(busquedaSet)) {
                    producto.idProveedor = proveedor._id;
                    arrayProductos = [...arrayProductos, producto]
                }
            });
        });

    }

    res.status(201).send({ proveedores: resultadoProveedores, productos: arrayProductos });
}

exports.searchOnlyProductos = async(req, res) => {
    const { busqueda } = req.body;
    let arrayProductos = [];
    let resultadoProductos;

    if (busqueda == '')
        resultadoProductos = await model.find({ tipo: busqueda });
    else
        resultadoProductos = await model.find({ 'productos.tipo': busqueda });

    if (resultadoProductos.length > 0) {

        resultadoProductos.filter(p => p.productos.tipo == busqueda);

        resultadoProductos.forEach(proveedor => {

            //Devolvemos solo los productos que corresponden al valor de la variable busqueda
            proveedor.productos.forEach(producto => {

                const nombreTipo = String(producto.tipo).toLowerCase();
                const busquedaSet = String(busqueda).toLowerCase();

                if (nombreTipo.includes(busquedaSet)) {
                    producto.idProveedor = proveedor._id;
                    arrayProductos = [...arrayProductos, producto]
                }
            });
        });

    }

    res.status(201).send(arrayProductos);
}

exports.searchProductoId = async(req, res) => {
    const { id } = req.body;
    let arrayProductos = [];

    const resultadoProductos = await model.find({ 'productos._id': id });

    if (resultadoProductos.length > 0) {

        resultadoProductos.filter(p => p.productos._id == id);

        resultadoProductos.forEach(proveedor => {

            //Devolvemos solo los productos que corresponden al valor de la variable busqueda
            proveedor.productos.forEach(producto => {

                if (producto._id == id) {
                    producto.idProveedor = proveedor._id;
                    arrayProductos = producto;
                }
            });
        });

    }

    res.status(201).send(arrayProductos);
}