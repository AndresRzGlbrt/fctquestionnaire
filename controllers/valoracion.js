'use strict'

var path = require('path');
var fs = require('fs');
var multipart = require('connect-multiparty');
var mongoosePagination = require('mongoose-pagination');

var Valoracion = require('../models/valoracion');

function guardarValoracion(req, res){
    var valoracion = new Valoracion();
    var params = req.body;
    if (params.nombre && /*(*/params.descripciones[0] != null/* || params.descripciones[0] != undefined || params.descripciones[0] != '')*/) {
        valoracion.nombre = params.nombre;
        valoracion.descripciones = params.descripciones;
        valoracion.save((err, valoracionStored)=>{
            if (err) {
                res.status(500).send({message: 'Error al guardar el tipo de valoracion'});
            } else {
                if (!valoracionStored) {
                    res.status(404).send({message: 'El tipo de valoracion no ha sido guardado'});
                } else {
                    res.status(200).send({valoracion: valoracionStored});
                }
            }
        });
    } else {
        res.status(500).send({message: 'Introduzca todos los campos para poder guardar el tipo de valoracion'});
    }
}

function mostrarValoracion(req, res) {
    var valoracionId = req.params.id;
    if (valoracionId) {
        Valoracion.findById(valoracionId, (err, valoracion)=>{
            if (err) {
                res.status(500).send({message: 'Error al mostrar el tipo de valoracion'});
            } else {
                if (!valoracion) {
                    res.status(404).send({message: 'El tipo de valoracion no existe'});
                } else {
                    res.status(200).send({valoracion});
                }
            }
        })
    } else {
        res.status(500).send({message: 'Introduzca una id'});
    }
}

function mostrarValoraciones(req, res) {
	if (req.params.page) {
		var page=req.params.page;
	} else {
		var page=1;
	}
	var itemsPerPage = 1000;
	Valoracion.find().sort('name').paginate(page, itemsPerPage, function(err, valoraciones, total) {
		if (err) {
			res.status(500).send({message:'Error en la petición'});
		} else {
			if (!valoraciones) {
				res.status(404).send({message:'No hay tipos de valoracion'});
			} else {
				return res.status(200).send({
					total_items: total,
					valoraciones: valoraciones
				});
			}
		}
	});
}

function updateValoracion(req, res) {
    var valoracionId = req.params.id;
    var update = req.body;
    if (valoracionId) {
        if(update.descripciones && update.nombre){
            Valoracion.findByIdAndUpdate(valoracionId, update, (err, valoracionUpdated) => {
                if (err) {
                    res.status(500).send({message: 'Error al guardar la valoracion'});
                } else {
                    if (!valoracionUpdated) {
                        res.status(404).send({message: 'La valoracion no existe'});
                    } else {
                        res.status(200).send({valoracion: valoracionUpdated});
                    }
                }
            });
        } else {
            res.status(500).send({message: 'Introduzca todos los datos'});
        }
    } else {
        res.status(500).send({message: 'Introduzca una id', });
    }
}

function deleteValoracion(req, res){
	var valoracionId= req.params.id;
	Valoracion.findByIdAndRemove(valoracionId, (err, valoracionRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error al borrar el tipo de valoracion'});
		}else{
            res.status(200).send({message: 'El tipo de valoracion fue eliminado'});
		}
	});
}

module.exports = {
    guardarValoracion,
    mostrarValoracion,
    mostrarValoraciones,
    updateValoracion,
    deleteValoracion
};
