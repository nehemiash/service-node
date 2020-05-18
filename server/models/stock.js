var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

let stockSchema = new Schema({
    codigo: {
        type: String,
        required: [true, "El codigo es necesario"],
        unique: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    marca: {
        type: String,
        required: false,
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: false,
    },
    referencia: {
        type: String,
        unique: true,
        required: [true, "El numero de referencia es necesario"],
    },
    precio: {
        type: Number,
        required: true,
    },
    cantidad: {
        type: Number,
        required: false,
        default: 0,
    },
    cobertura: {
        type: String,
        default: "OOW",
    },
    stockmin: {
        type: Number,
        required: false,
    },
    img: {
        type: String,
        default: "No Image",
        required: false,
    },
    disponible: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

stockSchema.plugin(uniqueValidator, {
    message: "{El codigo debe de ser unico}",
});

module.exports = mongoose.model("Stock", stockSchema);