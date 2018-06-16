'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'});

api.post('/login', UserController.loginUser);
api.post('/registerUser', UserController.saveUser);
api.post('/registerAdmin', md_auth.ensureAuth, UserController.saveAdmin);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUsuarioId);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsuarios);
api.get('/userYaRegistrado/:username', UserController.userYaRegistrado);
api.get('/usersRoleUser/:page?', md_auth.ensureAuth, UserController.getUsuariosRoleUser);
api.get('/usersRoleAdmin/:page?', md_auth.ensureAuth, UserController.getUsuariosRoleAdmin);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.UpdateUser);
api.delete('/deleteUser/:id', md_auth.ensureAuth, UserController.deleteUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;

