/*class usuario{
    constructor(id, nombre, apellido, correo, telefono, ubicacion, redessociales, tipoperro){
    this.id = id;
    this.nombre = nombre; // nombre de la mascota (o titulo del anuncio)
    this.apellido = apellido;
    this.correo = correo; // Dirreción del usuario
    this.telefono = telefono; // telefono-celular
    this.ubicacion = ubicacion;
    this.redessociales = redessociales; // Redes Sociales actuales para poder contactar al usuario
    this.tipoperro = tipoperro; // Tipo de perro que desea adoptar
    }
}

module.exports = usuario;
*/

// Usuario.js

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UsuarioSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true, //este campo no se puede repetir
      lowercase: true,
      required: [true, "no puede estar vacío"],
      match: [/^[a-zA-Z0-9]+$/, "es inválido"],
      index: true,
    },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: {
      type: String,
      unique: true, //este campo no se puede repetir
      lowercase: true,
      required: [true, "no puede estar vacío"],
      match: [/\S+@\S+\.\S+/, "es inválido"],
      index: true,
    },
    ubicacion: String,
    telefono: String,
    bio: String,
    foto: String,
    tipo: { type: String, enum: ['normal', 'anunciante'] },
    hash: String, //este campo se utilizará para la sesión
    salt: String, //este campo se utilizará para la sesión
  },
  { timestamps: true }
);


// usando plugin de validación para que no se repitan correos ni usernames
UsuarioSchema.plugin(uniqueValidator, { message: "Ya existe" });

UsuarioSchema.methods.crearPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex"); // generando una "sal" random para cada usuario
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex"); // generando un hash utilizando la sal
};

/**
 * Recibe el password, genera y compara el has con el de la base de datos
 */
UsuarioSchema.methods.validarPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UsuarioSchema.methods.generarJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60); // 60 días antes de expirar

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

/**
 * Devuelve la representación de un usuario después de autenticar
 */
UsuarioSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generarJWT()
  };
};

/**
* Devuelve la representación de un usuario, sólo datos públicos
*/
UsuarioSchema.methods.publicData = function(){
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    nombre: this.nombre,
    apellido: this.apellido,
    bio: this.bio,
    foto: this.foto,
    tipo: this.tipo,
    ubicacion: this.ubicacion,
    telefono: this.telefono,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

mongoose.model("Usuario", UsuarioSchema);