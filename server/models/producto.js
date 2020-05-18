var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;

var productoSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, "La descripcion es necesaria"],
    },
    numParte: {
        type: String,
        required: [true, "El numero de parte es necesario"],
        unique: true,
    },
    marca: {
        type: String,
        required: [true, "La marca  es necesaria"],
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
        required: false,
    },
    modelo: {
        type: String,
        required: [true, "El modelo  es necesario"],
    },
    color: {
        type: String,
        required: false,
    },
    configuracion: {
        type: String,
        required: false,
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true,
    },
    img: {
        type: String,
        required: false,
    },
}, { versionKey: false });

productoSchema.plugin(uniqueValidator, {
    message: "{Numero de Parte debe de ser unico}",
});

module.exports = mongoose.model("Producto", productoSchema);