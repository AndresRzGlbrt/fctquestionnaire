'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ValoracionSchema=Schema({
    nombre: String,
    descripciones: Array
});

module.exports= mongoose.model('Valoracion', ValoracionSchema);