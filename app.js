'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

//cargar rutas
var user_routes=require('./routes/user');
var cuestionario_routes=require('./routes/cuestionario');
var asignatura_routes=require('./routes/asignatura');
var item_routes=require('./routes/item');
var valoracion_routes=require('./routes/valoracion');

var path = require('path');

//configurar cabeceras http
app.use(bodyParser.urlencoded({extended:false}));
app.options('*', cors()); // include before other routes 
app.use(cors());
app.use(bodyParser.json());

//rutas base
app.use('/', express.static('client', {redirect: false}));
app.use('/api/users', user_routes);
app.use('/api/cuestionarios', cuestionario_routes);
app.use('/api/asignaturas', asignatura_routes);
app.use('/api/items', item_routes);
app.use('/api/valoraciones', valoracion_routes);

app.get('*', function(req, res, next) {
	res.sendFile(path.resolve('client/index.html'));
});

//Configuración peticiones AJAX
app.use((req, res, next)=>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Acceso-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

module.exports = app;