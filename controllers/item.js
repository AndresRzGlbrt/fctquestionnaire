'use strict'

var path = require('path');
var fs = require('fs');
var multipart = require('connect-multiparty');
var mongoosePagination = require('mongoose-pagination');

var Item = require('../models/item');

function guardarItem(req, res) {
    var item = new Item();
    var params = req.body;
    if (
        params.descripcion && params.idAsignatura
    ) {
        item.descripcion = params.descripcion;
        item.idAsignatura = params.idAsignatura;
        item.valoracion = 0;
        item.save((err, itemStored)=>{
            if (err) {
                res.status(500).send({message: 'Error al guardar el item'});
            } else {
                if (!itemStored) {
                    res.status(404).send({message: 'El item no ha sido guardado'});
                } else {
                    res.status(200).send({item: itemStored});
                }
            }
        });
    } else {
        res.status(500).send({message: 'Introduzca todos los campos para poder guardar el item'});
    }
}

function mostrarItem(req, res) {
    var itemId = req.params.id;
    if (itemId) {
        Item.findById(itemId, (err, item)=>{
            if (err) {
                res.status(500).send({message: 'Error al mostrar el item'});
            } else {
                if (!item) {
                    res.status(404).send({message: 'El item no existe'});
                } else {
                    res.status(200).send({item});
                }
            }
        })
    } else {
        res.status(500).send({message: 'Introduzca una id'});
    }
}

function mostrarItemsAsignatura(req, res) {
    var asignaturaAsignadaId = req.params.idAsignaturaAsignada;
    if (asignaturaAsignadaId) {
        if(req.params.page){
            var page=req.params.page;
        }else{
            var page=1;
        }
        var itemsPerPage = 1000;
        Item.find({idAsignatura: asignaturaAsignadaId}).sort('name').paginate(page, itemsPerPage, function(err, itemsAsignados, total) {
            if (err) {
                res.status(500).send({message:'Error en la petición'});
            } else {
                if (total === 0) {
                    res.status(404).send({message:'No hay items asignados a esa asignatura'});
                } else {
                    return res.status(200).send({
                        total_items: total,
                        items: itemsAsignados,
                        asignaturaId: asignaturaAsignadaId
                    });
                }
            }
        });
    }
    else {
        res.status(500).send({message: 'Introduzca una id de asignatura'});
    }
}

function updateItem(req, res) {
	var itemId=req.params.id;
	var update=req.body;
	if (itemId) {
		if(
            update.descripcion && update.idAsignatura && update.valoracion
        ){
			Item.findByIdAndUpdate(itemId, update, (err, itemUpdated)=>{
				if (err) {
					res.status(500).send({message: 'Error al guardar el item'});
				} else {
					if (!itemUpdated) {
						res.status(404).send({message: 'El item no existe'});
					} else {
						res.status(200).send({item: itemUpdated});
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

function updateItemValoracion(req, res) {
	var itemId=req.params.id;
	var update=req.body;
	if (itemId) {
		if(
            update.valoracion && update.idAsignatura
        ){
			Item.findByIdAndUpdate(idAsignatura, update, (err, itemUpdated)=>{
				if (err) {
					res.status(500).send({message: 'Error al cambiar la valoracion del item'});
				} else {
					if (!itemUpdated) {
						res.status(404).send({message: 'El item no existe'});
					} else {
						res.status(200).send({item: itemUpdated});
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

function deleteItem(req, res){
	var itemId= req.params.id;
	Item.findByIdAndRemove(itemId, (err, itemRemoved)=>{
		if (err) {
			res.status(500).send({message: 'Error al borrar el item'});
		} else {
            res.status(200).send({message: 'El item fue eliminado'});
		}
	});
}

module.exports = {
    guardarItem,
    mostrarItem,
    mostrarItemsAsignatura,
    updateItem,
    updateItemValoracion,
    deleteItem
};
