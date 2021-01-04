const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");
const { stringify } = require("querystring");

let Schema = mongoose.Schema;

let ordenSchema = new Schema({
    numero: Number,
    creado: Date,
    serie1: String,
    serie2: String,
    producto: {
        type: Schema.Types.ObjectId,
        ref: "Producto",
    },
    fechaCompra: Date,
    cobertura: String,
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "Cliente",
    },
    problema1: [{
        type: Schema.Types.ObjectId,
        ref: "Problema",
    }, ],
    ubicacion: String,
    accesorios: String,
    notaCliente: String,
    problema2: [{
        type: Schema.Types.ObjectId,
        ref: "Problema",
    }, ],
    notas: [{
        type: Schema.Types.ObjectId,
        ref: "Nota",
    }, ],
    obs: String,
    aspecto: String,
    reporte: String,
    tecnico: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
    repuestos: [{
        repuesto: {
            type: Schema.Types.ObjectId,
            ref: "Repuesto",
        },
        cantidad: Number,
        precio: Number,
    }, ],
    aprobado: Boolean, // si aprubea o no el valor de las piezas
    fechaAprob: Date, // la fecha en que se aprueba el presupuesto
    valorPreapro: Date, // la fecha en que se aprueba el presupuesto
    valorPcs: Number, // valor total de las piezas
    valorMo: Number, // mano de obra
    costoFlete: Number,
    valorTotal: Number,
    descuento: Number,
    entregada: Date,
    situacion: String,
    completada: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false });

ordenSchema.plugin(uniqueValidator, {
    message: "{El numero de orden debe ser unico}",
});

module.exports = mongoose.model("Orden", ordenSchema);