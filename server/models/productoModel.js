var mongoose = require("mongoose");
const { stringify } = require("querystring");
var Schema = mongoose.Schema;

var productoSchema = new Schema({
    descripcion: String,
    codigo: String,
    numParte: String,
    marca: String,
    modelo: String,
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "Categoria",
    },
    img: String,
    estado: {
        type: Boolean,
        default: true,
    },
}, { versionKey: false });

module.exports = mongoose.model("Producto", productoSchema);