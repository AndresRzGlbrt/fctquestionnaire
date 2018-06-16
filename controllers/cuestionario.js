'use strict'

var path = require('path');
var fs = require('fs');
var multipart = require('connect-multiparty');
var mongoosePagination = require('mongoose-pagination');

var Cuestionario = require('../models/cuestionario');

function guardarCuestionario(req, res){
    var cuestionario = new Cuestionario();
    var params = req.body;
    if (
        params.nombre &&
        params.idUserAsignado &&
        params.idValoracionAsignada &&
        params.idAdminCreador &&
        params.nombreCompletoUsuario
    ) {
        cuestionario.nombre = params.nombre;
        cuestionario.idUserAsignado = params.idUserAsignado;
        cuestionario.idValoracionAsignada = params.idValoracionAsignada;
        cuestionario.respondido = params.respondido;
        cuestionario.idAdminCreador = params.idAdminCreador;
        cuestionario.nombreCompletoUsuario = params.nombreCompletoUsuario;
        cuestionario.nombreCompletoAdmin = params.nombreCompletoAdmin;
        cuestionario.save((err, cuestionarioStored)=>{
            if (err) {
                res.status(500).send({message: 'Error al guardar el cuestionario'});
            } else {
                if (!cuestionarioStored) {
                    res.status(404).send({message: 'El cuestionario no ha sido guardado'});
                } else {
                    res.status(200).send({cuestionario: cuestionarioStored});
                }
            }
        });
    } else {
        res.status(500).send({message: 'Introduzca todos los campos para poder guardar el cuestionario'});
    }
}

function mostrarCuestionario(req, res) {
    var cuestionarioId = req.params.id;
    if (cuestionarioId) {
        Cuestionario.findById(cuestionarioId, (err, cuestionario)=>{
            if (err) {
                res.status(500).send({message: 'Error al mostrar el cuestionario'});
            } else {
                if (!cuestionario) {
                    res.status(404).send({message: 'El cuestionario no existe'});
                } else {
                    res.status(200).send({cuestionario});
                }
            }
        })
    } else {
        res.status(500).send({message: 'Introduzca una id'});
    }
}

function mostrarCuestionariosUser(req, res) {
    var userAsignadoId = req.params.idUserAsignado;
    if (userAsignadoId) {
        if(req.params.page){
            var page=req.params.page;
        }else{
            var page=1;
        }
        var itemsPerPage = 1000;
        Cuestionario.find({idUserAsignado: userAsignadoId, respondido: false})
            .sort('name').paginate(page, itemsPerPage, function(err, cuestionariosAsignados, total) {
            if (err) {
                res.status(500).send({message:'Error en la petición'});
            } else {
                if (total === 0) {
                    res.status(404).send({message:'No hay cuestionarios asignados a ese alumno'});
                } else {
                    return res.status(200).send({
                        total_items: total,
                        cuestionarios: cuestionariosAsignados,
                        userId: userAsignadoId
                    });
                }
            }
        });
    }
    else {
        res.status(500).send({message: 'Introduzca una id de user'});
    }
}

function mostrarNumCuestionariosValoracion(req, res) {
    var valoracionId = req.params.idValoracion;
    if (valoracionId) {
        if(req.params.page){
            var page=req.params.page;
        }else{
            var page=1;
        }
        var itemsPerPage = 1000;
        Cuestionario.find({idValoracionAsignada: valoracionId})
            .sort('name').paginate(page, itemsPerPage, function(err, cuestionariosAsignados, total) {
            if (err) {
                res.status(500).send({message:'Error en la petición'});
            } else {
                return res.status(200).send({
                    total_items: total
                });
            }
        });
    } else {
        res.status(500).send({message: 'Introduzca una id de valoracion'});
    }
}

function mostrarCuestionariosAdminUserRespondido(req, res) {
    if (req.params.page) {
        var page=req.params.page;
    } else {
        var page=1;
    }
    var itemsPerPage = 1000;
    var idAdmin = req.params.idAdminCreador;
    Cuestionario.find({respondido: true, idAdminCreador: idAdmin}).sort('name').paginate(page, itemsPerPage, function(err, cuestionariosAsignados, total) {
        if (err) {
            res.status(500).send({message:'Error en la petición'});
        } else {
            if (total === 0) {
                res.status(404).send({message:'No hay cuestionarios asignados a ese alumno'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    cuestionarios: cuestionariosAsignados
                });
            }
        }
    });
}

function mostrarCuestionariosModeloAdmin(req, res) {
    if (req.params.page) {
        var page=req.params.page;
    } else {
        var page=1;
    }
    var itemsPerPage = 1000;
    var idAdminCreador = req.params.idAdminCreador;
    Cuestionario.find({idUserAsignado: 'noUser', idAdminCreador: idAdminCreador}).sort('name')
        .paginate(page, itemsPerPage, function(err, cuestionariosAsignados, total) {
        if (err) {
            res.status(500).send({message:'Error en la petición'});
        } else {
            if (total === 0) {
                res.status(404).send({message:'No hay cuestionarios asignados a ese alumno'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    cuestionarios: cuestionariosAsignados
                });
            }
        }
    });
}

function mostrarCuestionariosUserRespondido(req, res) {
    if (req.params.page) {
        var page=req.params.page;
    } else {
        var page=1;
    }
    var itemsPerPage = 1000;
    var idUser = req.params.idUserAsignado;
    Cuestionario.find({respondido: true, idUserAsignado: idUser}).sort('name').paginate(page, itemsPerPage, function(err, cuestionariosAsignados, total) {
        if (err) {
            res.status(500).send({message:'Error en la petición'});
        } else {
            if (total === 0) {
                res.status(404).send({message:'No hay cuestionarios asignados a ese alumno'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    cuestionarios: cuestionariosAsignados
                });
            }
        }
    });
}

function updateCuestionario(req, res) {
	var cuestionarioId = req.params.id;
	var update = req.body;
	if (cuestionarioId) {
		if(
            update.nombre && (update.idUserAsignado === "noUser") && (update.nombreCompletoUsuario === "Modelo")
        ){
			Cuestionario.findByIdAndUpdate(cuestionarioId, update, (err, cuestionarioUpdated) => {
				if (err) {
					res.status(500).send({message: 'Error al guardar el cuestionario'});
				} else {
					if (!cuestionarioUpdated) {
						res.status(404).send({message: 'El cuestionario no existe'});
					} else {
						res.status(200).send({cuestionario: cuestionarioUpdated});
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

function updateCuestionarioARespondido(req, res) {
    var cuestionarioId = req.params.id;
    var update = req.body;
    if (cuestionarioId) {
        if (update.idUserAsignado) {
            update.respondido = true;
            Cuestionario.findByIdAndUpdate(cuestionarioId, update, (err, cuestionarioUpdated)=>{
                if (err) {
                    res.status(500).send({message: 'Error al guardar el cuestionario'});
                } else {
                    if (!cuestionarioUpdated) {
                        res.status(404).send({message: 'El cuestionario no existe'});
                    } else {
                        res.status(200).send({cuestionario: cuestionarioUpdated});
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

function deleteCuestionario(req, res){
	var cuestionarioId= req.params.id;
	Cuestionario.findByIdAndRemove(cuestionarioId, (err, cuestionarioRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error al borrar el cuestionario'});
		}else{
            res.status(200).send({message: 'El cuestionario fue eliminado'});
		}
	});
}

module.exports = {
    guardarCuestionario,
    mostrarCuestionario,
    mostrarCuestionariosUser,
    mostrarNumCuestionariosValoracion,
    mostrarCuestionariosAdminUserRespondido,
    mostrarCuestionariosModeloAdmin,
    mostrarCuestionariosUserRespondido,
    updateCuestionario,
    updateCuestionarioARespondido,
    deleteCuestionario
};
