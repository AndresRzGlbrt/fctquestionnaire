'use strict'

var path = require('path');
var fs = require('fs');
var multipart = require('connect-multiparty');
var mongoosePagination = require('mongoose-pagination');

var Asignatura = require('../models/asignatura');

function guardarAsignatura(req, res) {
    var asignatura = new Asignatura();
    var params = req.body;
    if (
        params.nombre && params.idCuestionario
    ) {
        asignatura.nombre = params.nombre;
        asignatura.idCuestionario = params.idCuestionario;
        asignatura.save((err, asignaturaStored)=>{
            if (err) {
                res.status(500).send({message: 'Error al guardar la asignatura'});
            } else {
                if (!asignaturaStored) {
                    res.status(404).send({message: 'La asignatura no ha sido guardado'});
                } else {
                    res.status(200).send({asignatura: asignaturaStored});
                }
            }
        });
    } else {
        res.status(500).send({message: 'Introduzca todos los campos para poder guardar la asignatura'});
    }
}

function mostrarAsignatura(req, res) {
    var asignaturaId = req.params.id;
    if (asignaturaId) {
        Asignatura.findById(asignaturaId, (err, asignatura)=>{
            if (err) {
                res.status(500).send({message: 'Error al mostrar la asignatura'});
            } else {
                if (!cuestionario) {
                    res.status(404).send({message: 'La asignatura no existe'});
                } else {
                    res.status(200).send({asignatura});
                }
            }
        })
    } else {
        res.status(500).send({message: 'Introduzca una id'});
    }
}

function mostrarAsignaturasCuestionario(req, res) {
    var cuestionarioAsignadoId = req.params.idCuestionarioAsignado;
    if (cuestionarioAsignadoId) {
        if(req.params.page){
            var page=req.params.page;
        }else{
            var page=1;
        }
        var itemsPerPage = 1000;
        Asignatura.find({idCuestionario: cuestionarioAsignadoId}).sort('name').paginate(page, itemsPerPage, function(err, asignaturasAsignadas, total) {
            if(err){
                res.status(500).send({message:'Error en la petición'});
            }else{
                if(total === 0){
                    res.status(404).send({message:'No hay asignaturas asignadas a ese cuestionario'});
                }else{
                    return res.status(200).send({
                        total_items:total,
                        asignaturas: asignaturasAsignadas,
                        cuestionarioId: cuestionarioAsignadoId
                    })
                }
            }
        });
    }
    else {
        res.status(500).send({message: 'Introduzca una id de cuestionario'});
    }
}

function updateAsignatura(req, res) {
	var asignaturaId = req.params.id;
	var update=req.body;
	if (asignaturaId) {
		if(
            update.nombre && update.idCuestionario
        ){
			Asignatura.findByIdAndUpdate(asignaturaId, update, (err, asignaturaUpdated)=>{
				if (err) {
					res.status(500).send({message: 'Error al guardar la asignatura'});
				} else {
					if (!asignaturaUpdated) {
						res.status(404).send({message: 'La asignatura no existe'});
					} else {
						res.status(200).send({asignatura: asignaturaUpdated});
					}
				}
			});
		} else {
			res.status(500).send({message: 'Introduzca todos los datos'});
		}
	} else {
		res.status(500).send({message: 'Introduzca una id'});
	}
}

function deleteAsignatura(req, res){
	var asignaturaId= req.params.id;
	Asignatura.findByIdAndRemove(asignaturaId, (err, asignaturaRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error al borrar la asignatura'});
		}else{
            res.status(200).send({message: 'La asignatura fue eliminada'});
		}
	});
}

module.exports = {
    guardarAsignatura,
    mostrarAsignatura,
    mostrarAsignaturasCuestionario,
    updateAsignatura,
    deleteAsignatura
};
