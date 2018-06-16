'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var AsignaturaSchema=Schema({
    nombre: String,
    idCuestionario: String
});

module.exports= mongoose.model('Asignatura', AsignaturaSchema);