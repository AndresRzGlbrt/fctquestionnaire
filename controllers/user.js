'use strict'

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../service/jwt');
var fs = require('fs');
var path =require('path');

var User = require('../models/user')

function saveUser(req, res){
	var user = new User();
	var params = req.body;
	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.rol = 'ROLE_USER';
	user.image = 'userImageNotFound.png';
	if (params.password && params.password.length >= 4) {
		bcrypt.hash(params.password, null, null, function(err,hash) {
			user.password=hash;
			if (user.name!=null && user.surname!=null && user.email!=null) {
				user.save((err, userStored)=>{
					if (err) {
						res.status(500).send({message:'Error al guardar USER'});
					} else {
						if (!userStored) {
							res.status(400).send({message:'No se ha registrado el USER'});
						} else {
							res.status(200).send({user: userStored});
						}
					}
				});
			} else {
				res.status(200).send({message:'Rellena todos los campos'});
			}
		});
	} else {
		res.status(500).send({message:'Introduce una contraseña mayor de 3 caracteres'+ params});
	}
}

function saveAdmin(req, res){
    var user = new User();
    var params = req.body;
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.rol = 'ROLE_ADMIN';
    user.image = 'userImageNotFound.png';
    if (params.password && params.password.length >= 4) {
        bcrypt.hash(params.password, null, null, function(err,hash) {
            user.password=hash;
            if (user.name!=null && user.surname!=null &&  user.email!=null) {
                user.save((err, userStored)=>{
                    if (err) {
                        res.status(500).send({message:'Error al guardar ADMIN'});
                    } else {
                        if (!userStored) {
                            res.status(400).send({message:'No se ha registrado el ADMIN'});
                        } else {
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            } else {
                res.status(200).send({message:'Rellena todos los campos'});
            }
        });
    } else {
        res.status(500).send({message:'Introduce una contraseña mayor de 3 caracteres'+ params});
    }
}

function getUsuarioId(req, res) {
    var userId = req.params.id;
    if (userId) {
        User.findById(userId, (err, user)=>{
            if (err) {
                res.status(500).send({message: 'Error al mostrar el user'});
            } else {
                if (!user) {
                    res.status(404).send({message: 'El user no existe'});
                } else {
                    res.status(200).send({user});
                }
            }
        })
    } else {
        res.status(500).send({message: 'Introduzca una id'});
    }
}

function getUsuarios(req, res) {
	if (req.params.page) {
		var page=req.params.page;
	} else {
		var page=1;
	}
	var itemsPerPage = 20000;
	User.find().paginate(page, itemsPerPage, function(err, users, total) {
		if (err) {
			res.status(500).send({message:'Error en la petición'});
		} else {
			if (!users) {
				res.status(404).send({message:'No hay usuarios'});
			} else {
				return res.status(200).send({
					total_items:total,
					users:users
				});
			}
		}
	});
}

function getUsuariosRoleUser(req, res) {
    if (req.params.page) {
        var page=req.params.page;
    } else {
        var page=1;
    }
    var itemsPerPage = 20000;
    User.find({rol: 'ROLE_USER'}).paginate(page, itemsPerPage, function(err, users, total) {
        if (err) {
            res.status(500).send({message:'Error en la petición'});
        } else {
            if (!users) {
                res.status(404).send({message:'No hay usuarios'});
            } else {
                return res.status(200).send({
                    total_items:total,
                    users:users
                });
            }
        }
    });
}

function getUsuariosRoleAdmin(req, res) {
    if (req.params.page) {
        var page=req.params.page;
    } else {
        var page=1;
    }
    var itemsPerPage = 20000;
    User.find({rol: 'ROLE_ADMIN'}).paginate(page, itemsPerPage, function(err, users, total) {
        if (err) {
            res.status(500).send({message:'Error en la petición'});
        } else {
            if (!users) {
                res.status(404).send({message:'No hay usuarios'});
            } else {
                return res.status(200).send({
                    total_items:total,
                    users:users
                });
            }
        }
    });
}

function loginUser(req, res){
	var params = req.body;
	var email = params.email;
	var password = params.password;

	User.findOne({email:email}, (err, user) => {
		if (err) {
			res.status(500).send({message:'Error en la peticion'});
		} else {
			if (!user) {
				res.status(404).send({message:'El usuario no existe'});
			} else {
				bcrypt.compare(password, user.password, function (err, check) {
					if (check) {
						if (params.gethash) {
							res.status(200).send({
								token:jwt.createToken(user)
							});
						} else {
							res.status(200).send({user});
						}
					} else {
						res.status(404).send({message:'El usuario no ha podido loguearse'});
					}
				})
			}
		}
	});
}

function UpdateUser(req, res) {
	var userId = req.params.id;
	var update = req.body;
	console.log(userId);
	console.log(update);
	if (userId != req.user.sub) {
	  return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
	}
	if (update.password != null && update.password.length >= 4) {
		if (update.name != null && update.surname != null &&  update.email != null) {
			bcrypt.hash(update.password, null, null, function(err,hash){
				update.password=hash;
				User.findByIdAndUpdate(userId, update, (err, userUpdated)=> {
					if (err) {
						res.status(500).send({message: 'Error al actualizar el usuario'});
					} else {
						if (!userUpdated) {
							res.status(404).send({message: 'No se ha podido actualizar el usuario'});
						} else {
							res.status(200).send({user: userUpdated});
						}
					}
				});
			});
		} else {
			res.status(500).send({message:'Introduce todos los datos'});
		}
	} else {
		res.status(500).send({message:'Introduce una contraseña mayor de tres caracteres'+ params});
	}
}

function uploadImage(req, res){
	var userId=req.params.id;
	var file_name = 'No subido...';
	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		if(file_ext=='png' || file_ext=='jpg' || file_ext=='gif'){
			User.findByIdAndUpdate(userId, {image:file_name}, (err, userUpdated)=> {
				if(err){
					res.status(500).send({message: 'Error al realizar la petición'})
				}
				if(!userUpdated){
					res.status(404).send({message:'No se ha podido actualizar el usuario'});
				}
				else{
					res.status(200).send({user: userUpdated});
				}
			});
		}
		console.log(file_path);
	} else {
		res.status(500).send({message:'No has subido ninguna imagen'});
	}
}

function getImageFile(req, res) {
	var imagefile = req.params.imageFile;
	var path_file = './uploads/users/' + imagefile;

	fs.exists(path_file, function(exists) {
		if (exists) {
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(500).send({message:'No existe la imagen...'});
		}
	});
}

function userYaRegistrado(req, res) {
	var userName = req.params.username;
    if (userName) {
        if(req.params.page){
            var page=req.params.page;
        }else{
            var page=1;
        }
        var itemsPerPage = 1000;
        User.find({email: userName})
            .sort('name').paginate(page, itemsPerPage, function(err, usuarioEncontrado, total) {
            if (err) {
                res.status(500).send({message:'Error en la petición'});
            } else {
                return res.status(200).send({
                    total_items: total
                });
            }
        });
    } else {
        res.status(500).send({message: 'Introduzca un nombre de usuario'});
    }
}

function deleteUser(req, res) {
    var userId= req.params.id;
    User.findByIdAndRemove(userId, (err, userRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al borrar el usuario'});
        }else{
            res.status(200).send({message: 'El usuario fue eliminado'});
        }
    });
}

module.exports={
	saveUser,
    saveAdmin,
	getUsuarioId,
    getUsuarios,
    getUsuariosRoleUser,
    getUsuariosRoleAdmin,
	loginUser,
	UpdateUser,
	uploadImage,
	getImageFile,
    userYaRegistrado,
	deleteUser
};
