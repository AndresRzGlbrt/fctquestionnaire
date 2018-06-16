'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var CuestionarioSchema=Schema({
    nombre: String,
    idUserAsignado: String,
    idValoracionAsignada: String,
    respondido: Boolean,
    nombreCompletoUsuario: String,
    idAdminCreador: String,
    nombreCompletoAdmin: String
});

module.exports= mongoose.model('Cuestionario', CuestionarioSchema);