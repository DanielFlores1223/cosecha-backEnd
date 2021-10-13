const express = require('express');
const app = express();
const initDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3001;

//archivos de rutas
const administradorRuta = require('./app/routes/administrador');
const proveedorRuta = require('./app/routes/proveedor');
const clienteRuta = require('./app/routes/cliente');
const loginRuta = require('./app/routes/login');

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))


app.get('/', (req, res) => {
    res.send({
        data: "Hola Mundo"
    });
});

app.listen(port, () => {
    console.log('La app está en línea');
});

initDB();

app.use(
    bodyParser.json({
        limit: '20mb'
    })
)

app.use(
    bodyParser.urlencoded({
        limit: '20mb',
        extended: true
    })
)

//rutas en uso
app.use(administradorRuta);
app.use(proveedorRuta);
app.use(clienteRuta);
app.use(loginRuta);

//rutas que permiten acceder a las carpetas de imagenes
app.use('/img-administrador', express.static('img-administrador'));
app.use('/img-proveedor', express.static('img-proveedor'));
app.use('/img-cliente', express.static('img-cliente'));