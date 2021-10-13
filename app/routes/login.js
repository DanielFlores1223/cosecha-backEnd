const express = require('express');
const router = express.Router();
const path = '/login';

const controller = require('../controllers/login');

router.post(`${path}`, controller.login);

module.exports = router;