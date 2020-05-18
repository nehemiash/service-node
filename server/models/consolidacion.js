const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let consolidacionSchema = new Schema({
    numero: {
        type: String,
        required: [true, "El numero es requerido"],
        unique: true,
    },
    guia: {
        type: String,
        required: false,
    },
    courier: {
        type: String,
        required: false,
    },
    estado: {
        type: String,
        required: false,
        default: "Preparacion",
    },
    fecha: {
        type: Date,
        required: false,
    },
    cantidad: {
        type: Number,
        required: false,
    },
    valor: {
        type: Number,
        required: false,
    },
    cobertura: {
        type: String,
        required: false,
    },
    lista: [{
        type: Schema.Types.ObjectId,
        ref: "Kbb",
    }, ],
    peso: {
        type: Number,
        required: false,
    },
    dimensiones: {
        type: String,
        required: false,
    },
    completado: {
        type: Boolean,
        required: false,
        default: false,
    },
    activo: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

consolidacionSchema.plugin(uniqueValidator, {
    message: "{Numero de consolidacion debe de ser unico}",
});

module.exports = mongoose.model("Consolidacion", consolidacionSchema);