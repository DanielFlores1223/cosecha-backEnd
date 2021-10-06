const express = require('express');
const router = express.Router();
const path = '/proveedor';

const controller = require('../controllers/proveedor');

router.get(`${path}`, controller.getData);

module.exports = router;