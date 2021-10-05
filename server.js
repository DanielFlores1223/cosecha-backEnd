const express = require('express');
const app = express();
const initDB = require('./config/db');

const port = 3001;

app.get('/', (req, res) => {
    res.send({
        data: "Hola Mundo"
    });
});

app.listen(port, () => {
    console.log('La app está en línea');
});

initDB();