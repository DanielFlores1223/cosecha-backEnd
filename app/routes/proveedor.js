const express = require('express');
const router = express.Router();
const path = '/proveedor';

const controller = require('../controllers/proveedor');

router.get(`${path}`, controller.getData);

router.post(`${path}`, controller.upload, controller.insert);
router.post(`${path}/addProducto/:id`, controller.upload, controller.addProducto);

router.delete(`${path}/:id`, controller.deleteSingle);
router.delete(`${path}/deleteProducto/:idProv/:idProd`, controller.deleteProducto);

router.put(`${path}/:id`, controller.updateSingle);
router.put(`${path}/img/:id`, controller.upload, controller.updateSingleImg);
router.put(`${path}/updateProducto/:idProv/:idProd`, controller.updateProducto);
router.put(`${path}/updateProducto/img/:idProv/:idProd`, controller.upload, controller.updateProductoImg);

module.exports = router;