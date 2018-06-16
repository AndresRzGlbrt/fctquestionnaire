var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://159.65.18.9:27017/fctquestionnaire', (err, res) => {
	if (err) {
		throw err;
	} else {
		console.log("La conexión a la base de datos es correcta.");
		app.listen(port, function(){
			console.log("Servidor escuchando en http://159.65.18.9: "+port);
		});
	}
});