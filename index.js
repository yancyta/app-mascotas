require('dotenv').config();
const path = require('path'); // esto es de nodjs
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());
// lectura y parseo del body 
app.use(express.json());
// Base de datos
dbConnection();
//console.log(process.env);
// Directorio público
app.use(express.static('public'));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
//-----------------------------------------------------------
app.use('/api/veterinarias', require('./routes/veterinarias'));
app.use('/api/veterinarios', require('./routes/veterinarios'));
app.use('/api/mascotas', require('./routes/mascotas'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
/*app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});*/
app.use('/api/login', require('./routes/autent'));
//---------------------------------------------------------------
app.use('/api/login', require('./routes/autent'));
//app.use('/api/', require('./routes/autent'));
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});