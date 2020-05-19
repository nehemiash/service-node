const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let kbbSchema = new Schema({
    sro: {
        type: Schema.Types.ObjectId,
        ref: "Sro",
        required: [true, "El numero de SRO es necesario"],
    },
    parteapple: {
        type: Schema.Types.ObjectId,
        ref: "ParteApple",
    },
    kbb: {
        type: String,
        required: false,
        default: "N/A",
    },
    kgb: {
        type: String,
        required: false,
        default: "N/A",
    },
    guiaImp: {
        type: String,
        required: false,
    },
    guiaExp: {
        type: String,
        required: false,
    },
    consolidado: {
        type: Boolean,
        required: false,
        default: false,
    },
    consolidacion: {
        type: Schema.Types.ObjectId,
        ref: "Consolidacion",
    },
    reposicionStock: {
        type: Boolean,
        default: false,
        required: false,
    },
    estado: {
        type: String,
        required: false,
        default: "En preparacion",
    },
    notas: [{
        type: Schema.Types.ObjectId,
        ref: "Nota",
        required: false,
    }, ],
    cobertura: {
        type: String,
        required: false,
    },
    activo: {
        type: Boolean,
        required: false,
        default: true,
    },
    creado: {
        type: Date,
        required: true,
    },
}, { versionKey: false });

module.exports = mongoose.model("Kbb", kbbSchema);