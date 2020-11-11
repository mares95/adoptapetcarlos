/* Archivo controllers/mascotas.js
 * Simulando la respuesta de objetos Mascota
 * en un futuro aqui se tuilizaŕan los modelos



*/


//const Mascota = require('../models/Mascota')

/*function crearMascota(req, res){
    //Instanciaremos un nuevo Mascota utiliando la clase Mascota
    var mascota = new Mascota(req.body)
    res.status(201).send(mascota)
}*/
const mongoose = require('mongoose')
const Mascota = mongoose.model('Mascota')

function crearMascota(req, res, next) {
  var mascota = new Mascota(req.body)
  mascota.anunciante = req.usuario.id
  mascota.estado = 'disponible'
  mascota.save().then(mascota => {
    res.status(201).send(mascota)
  }).catch(next)
}


/*function obtenerMascotas(req, res){
    // SImulando dos Mascota y respondiendolos
    //constructor(id, nombre, categoria, fotos)
    var mascota1 = new Mascota(1, 'Panchita', 'Golden', 'https://ichef.bbci.co.uk/news/800/cpsprodpb/15665/production/_107435678_perro1.jpg')
    var mascota2 = new Mascota(2, 'Ramoncilla', 'Chihuahua', 'https://www.purina.es/sites/g/files/mcldtz1656/files/2019-06/Chihuahua%20%28de%20pelo%20suave%29%20_400x378_0.jpg')
    res.send([mascota1, mascota2])
}*/
function obtenerMascotas(req, res, next) {
    if(req.params.id){
      Mascota.findById(req.params.id)
              .populate('anunciante', 'username nombre apellido bio foto').then(mascotas => {
            res.send(mascotas)
          }).catch(next)
    } else {
      Mascota.find().then(mascotas=>{
        res.send(mascotas)
      }).catch(next)
    }
  }

/*function modificarMascota(req, res){
    // Simulando un Mascota previamente existente que el Mascota utiliza
    var mascota1 = new Mascota(req.params.id, 'Panchita', 'Golden', 'https://ichef.bbci.co.uk/news/800/cpsprodpb/15665/production/_107435678_perro1.jpg')
    var modificaciones = req.body
    mascota1 = { ...mascota1, ...modificaciones}
    res.send(mascota1)
}*/

function modificarMascota(req, res, next) {
  console.log("Mascota a modificar: " + req.params.id ) //req.param.id - Mascota en uri
  Mascota.findById(req.params.id).then(mascota => { //Busca la mascota que se recibe como parámetro.
    if (!mascota) { return res.sendStatus(401); }   //Si no se encuentra mascota, retorna estaus 401.---
    let idUsuario=req.usuario.id;                   //User en JWT
    console.log("Usuario que modifica " + idUsuario);
    let idAnunciante=mascota.anunciante;
    console.log(" Anunciante mascota: " + idAnunciante);
    if( idUsuario == idAnunciante ){
      let nuevaInfo = req.body
      if (typeof nuevaInfo.nombre !== 'undefined')
        mascota.nombre = nuevaInfo.nombre
      if (typeof nuevaInfo.categoria !== 'undefined')
        mascota.categoria = nuevaInfo.categoria
      if (typeof nuevaInfo.fotos !== 'undefined')
        mascota.fotos = nuevaInfo.fotos
      if (typeof nuevaInfo.descripcion !== 'undefined')
        mascota.descripcion = nuevaInfo.descripcion
      if (typeof nuevaInfo.anunciante !== 'undefined')
        mascota.anunciante = nuevaInfo.anunciante
      if (typeof nuevaInfo.ubicacion !== 'undefined')
        mascota.ubicacion = nuevaInfo.ubicacion
      mascota.save().then(updatedMascota => {
        res.status(201).json(updatedMascota.publicData())
      }).catch(next)
    }
    else{
      return res.sendStatus(401);
    }
  }).catch(next)
}


/*function eliminarMascota(req, res){
    res.status(200).send(`Mascota ${req.params.id} eliminado`)
}*/


function eliminarMascota(req, res) {
  // únicamente borra a su propio mascota obteniendo el id del token
  Mascota.findById(req.params.id).then(mascota => {
    if (!mascota) { return res.sendStatus(401); }
    let idUsuario=req.usuario.id;
    console.log("Usuario que modifica " + idUsuario);
    let idAnunciante=mascota.anunciante;
    console.log(" Anunciante mascota: " + idAnunciante);
    if( idUsuario == idAnunciante ){
      let nombreMascota = mascota.nombre;
      mascota.deleteOne();
      res.status(200).send(`Mascota${req.params.id} eliminada. ${nombreMascota}`);
    }else{
      return res.sendStatus(401);
    }
  });
}

module.exports = {
    crearMascota,
    obtenerMascotas,
    modificarMascota,
    eliminarMascota
}