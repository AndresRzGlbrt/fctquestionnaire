'use strict'

var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ItemSchema=Schema({
    descripcion: String,
    idAsignatura: String,
    valoracion: String,
});

module.exports = mongoose.model('Item', ItemSchema);