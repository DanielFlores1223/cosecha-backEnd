const express = require('express');
const router = express.Router();
const path = '/cliente';

const controller = require('../controllers/cliente');

router.get(`${path}`, controller.getData);

router.post(`${path}`, controller.upload, controller.insert);

router.delete(`${path}/:id`, controller.deleteSingle);

router.put(`${path}/:id`, controller.updateSingle);
router.put(`${path}/img/:id`, controller.upload, controller.updateSingleImg);

//pedidos
router.post(`${path}/addPedido/:id`, controller.addPedido);

router.delete(`${path}/deletePedido/:idCliente/:idPedido`, controller.deletePedido);

router.put(`${path}/updatePedido/:idCliente/:idPedido`, controller.updateProducto);

module.exports = router;