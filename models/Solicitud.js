
/*class Solicitud{
    constructor(id, razaPerro, tiempoenCentro, nombrePerro, pelaje, idAnunciante, idSolicitante, estado){
    this.id = id;
    this.razaPerro = razaPerro; // nombre de la mascota (o titulo del anuncio)
    this.tiempoenCentro = tiempoenCentro; // edad
    this.nombrePerro = nombrePerro; // Dirreción del usuario
    this.pelaje = pelaje; // El cliente como se considera?? Adoptante ó Cuidador
    this.idAnunciante = idAnunciante;
    this.idSolicitante = idSolicitante;
    this.estado = estado;
    }
}

module.exports = Solicitud;*/

const mongoose = require("mongoose");

var SolicitudSchema = new mongoose.Schema(
  {
    mascota: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Mascota",
    },
    anunciante: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Usuario",
    },
    solicitante: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Usuario",
    },
    estado: { type: String, enum: ["aceptada", "cancelada", "pendiente"] },
  },
  { collection: "solicitudes", timestamps: true }
);


SolicitudSchema.methods.publicData = function(){
  return {
    id: this.id,
    idMascota: this.idMascota,
    fechaCreacion: this.fechaCreacion,
    idAnunciante: this.idAnunciante,
    idSolicitante: this.idSolicitante,
    estado: this.estado
  };
};

mongoose.model('Solicitud', SolicitudSchema)