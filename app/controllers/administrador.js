const moongose = require('mongoose');
const model = require('../models/administrador');
const generalFunctions = require('./generalFunctions');
const multer = require('multer');
const fs = require('fs-extra');

let pathImg = '';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'img-administrador')
    },
    filename: function(req, file, cb) {
        pathImg = `/img-administrador/${Date.now()}-${file.originalname}`;
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });
exports.upload = upload.single('imagen');

exports.getData = async(req, res) => {
    await model.find({}, (err, data) => {

        if (err)
            return res.send(err);

        res.send(data);
    }).clone().catch(function(err) { console.log(err) });
}

exports.getSingleLogin = async(req, res) => {
    const { email, password } = req.body;
    const modelFind = await model.findOne({ email });

    if (modelFind) {
        if (password === modelFind.password)
            res.send({ status: true, user: modelFind, type: 'administrador' });
        else
            res.send({ status: false });

    } else
        res.send({ status: false });

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

const parseId = (id) => { return moongose.Types.ObjectId(id) };

exports.deleteSingle = async(req, res) => {
    const { id } = req.params;

    const admin = await model.findById({ _id: id });

    //Eliminamos la imagen
    if (admin)
        await fs.unlink(`./${admin.img}`);

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