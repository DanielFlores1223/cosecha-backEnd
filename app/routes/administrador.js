const express = require('express');
const router = express.Router();
const path = '/administrador';

const controller = require('../controllers/administrador');

router.get(`${path}`, controller.getData);
router.post(`${path}`, controller.upload, controller.insert);
router.post(`${path}/login`, controller.getSingleLogin);
router.delete(`${path}/:id`, controller.deleteSingle);
router.put(`${path}/:id`, controller.updateSingle);
router.put(`${path}/img/:id`, controller.upload, controller.updateSingleImg);

module.exports = router;