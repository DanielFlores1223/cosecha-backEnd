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