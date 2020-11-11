/*const Usuario = require('../models/Usuario')

function crearUsuario(req, res){
    //Instanciaremos un nuevo usuario utiliando la clase usuario
    var usuario = new Usuario(req.body)
    res.status(201).send(usuario)
}

function obtenerUsuario(req, res){
    // SImulando dos usuario y respondiendolos
    var usuario1 = new Usuario(1, 'Juan', 'Vega', 'juan@vega.com')
    var usuario2 = new Usuario(2, 'Monserrat', 'Vega', 'mon@vega.com')
    res.send([usuario1, usuario2])
}

function modificarUsuario(req, res){
    // Simulando un usuario previamente existente que el usuario utiliza
    var usuario1 = new Usuario(req.params.id, 'Juan', 'Vega', 'juan@vega.com')
    var modificaciones = req.body
    usuario1 = { ...usuario1, ...modificaciones}
    res.send(usuario1)
}

function eliminarUsuario(req, res){
    res.status(200).send(`Usuario ${req.params.id} eliminado`)
}

module.exports = {
    crearUsuario,
    obtenerUsuario,
    modificarUsuario,
    eliminarUsuario
}**/

// controllers/usuarios.js
const mongoose = require("mongoose")
const Usuario = mongoose.model("Usuario")
const passport = require('passport');

function crearUsuario(req, res, next) {
  // Instanciaremos un nuevo usuario utilizando la clase usuario
  const body = req.body,
    password = body.password

  delete body.password
  const usuario = new Usuario(body)
  usuario.crearPassword(password)
  usuario.save().then(user => {
    return res.status(201).json(user.toAuthJSON())
  }).catch(next)
}

function obtenerUsuarios(req, res, next) {
  Usuario.findById(req.usuario.id, (err, user) => {
    if (!user || err) {
      return res.sendStatus(401)
    }
    return res.json(user.publicData());
  }).catch(next);
}

function modificarUsuario(req, res, next) {
  console.log(req.usuario)
  Usuario.findById(req.usuario.id).then(user => {
    if (!user) { return res.sendStatus(401); }
    let nuevaInfo = req.body
    if (typeof nuevaInfo.username !== 'undefined')
      user.username = nuevaInfo.username
    if (typeof nuevaInfo.bio !== 'undefined')
      user.bio = nuevaInfo.bio
    if (typeof nuevaInfo.tipo !== 'undefined')  //Agregadas en Reto1
      user.bio = nuevaInfo.tipo                 //Agregadas en Reto1
    if (typeof nuevaInfo.foto !== 'undefined')
      user.foto = nuevaInfo.foto
    if (typeof nuevaInfo.ubicacion !== 'undefined')
      user.ubicacion = nuevaInfo.ubicacion
    if (typeof nuevaInfo.telefono !== 'undefined')
      user.telefono = nuevaInfo.telefono
    if (typeof nuevaInfo.password !== 'undefined')
      user.crearPassword(nuevaInfo.password)
    user.save().then(updatedUser => {
      res.status(201).json(updatedUser.publicData())
    }).catch(next)
  }).catch(next)
}

function eliminarUsuario(req, res) {
  // únicamente borra a su propio usuario obteniendo el id del token
  Usuario.findOneAndDelete({ _id: req.usuario.id }).then(r => {
    res.status(200).send(`Usuario ${req.params.id} eliminado: ${r}`);
  })
}

function iniciarSesion(req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "no puede estar vacío" } });
  }

  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "no puede estar vacío" } });
  }

  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generarJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
}

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  modificarUsuario,
  eliminarUsuario,
  iniciarSesion
}