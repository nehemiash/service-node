const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let ordenSchema = new Schema({
    numero: {
        type: Number,
        required: [true, "El numero de orden es necesario"],
        unique: true,
    },
    centro: {
        type: Schema.Types.ObjectId,
        ref: "Centro",
    },
    creado: {
        type: Date,
        required: false,
    },
    entregado: {
        type: Date,
        required: false,
    },
    serie: {
        type: String,
        required: [true, "El numero de orden es necesario"],
    },
    imei: {
        type: String,
        required: false,
    },
    sustituido: {
        type: String,
        required: false,
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: "Producto",
    },
    fechaCompra: {
        type: Date,
        required: false,
    },
    cobertura: {
        type: String,
        required: false,
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "Cliente",
    },
    estado: {
        type: String,
        required: false,
    },
    ubicacion: {
        type: String,
        required: false,
    },
    accesorios: {
        type: String,
        required: false,
    },
    problema: {
        type: String,
        required: false,
    },
    aspecto: {
        type: String,
        required: false,
    },
    servRealizado: {
        type: String,
        required: false,
    },
    tecnico: {
        type: Schema.Types.ObjectId,
        ref: "Tecnico",
    },
    sro: [{
        type: Schema.Types.ObjectId,
        ref: "Sro",
    }, ],
    nota: [{
        type: Schema.Types.ObjectId,
        ref: "Nota",
    }, ],
    informe: {
        type: String,
        required: false,
    },
    presupuesto: {
        type: Schema.Types.ObjectId,
        ref: "Presupuesto",
    },
    completada: {
        type: Boolean,
        required: false,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
    },
}, { versionKey: false });

ordenSchema.plugin(uniqueValidator, {
    message: "{El numero de orden debe de ser unico}",
});

module.exports = mongoose.model("Orden", ordenSchema);