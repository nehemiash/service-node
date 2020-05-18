var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var parteAppleSchema = new Schema({
    numParte: {
        type: String,
        required: [true, "El numero de parte es necesario"],
        unique: true,
    },
    descripcion: {
        type: String,
        required: false,
    },
    sku: {
        type: String,
        required: false,
    },
    precioStock: {
        type: Number,
        required: false,
        default: 0,
    },
    precioExchange: {
        type: Number,
        required: false,
        default: 0,
    },
    precioCore: {
        type: Number,
        required: false,
        default: 0,
    },
    precioRegular: {
        type: Number,
        required: false,
        default: 0,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: false,
    },
    disponible: {
        type: Boolean,
        default: true,
    },
    img: {
        type: String,
        required: false,
    },
}, { versionKey: false });

parteAppleSchema.plugin(uniqueValidator, {
    message: "{Numero de Parte debe de ser unico}",
});

module.exports = mongoose.model("ParteApple", parteAppleSchema);