const mongoose = require('mongoose');
const credenciales = require('./credenciales');
const DB_URl = credenciales();
const configDB = {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const estadoConexión = err => {
    if (err)
        console.log('DB: Error!');
    else
        console.log('Conexión exitosa');
}

module.exports = () => {
    const connect = () => mongoose.connect(DB_URl, configDB, estadoConexión);
    connect();
}