const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let presupuestoSchema = new Schema({
    numero: {
        type: Number,
        unique: true,
        required: [true, "El numero es necesario"],
    },
    stock: [{
        type: Schema.Types.ObjectId,
        ref: "Stock",
    }, ],
    parteapple: [{
        type: Schema.Types.ObjectId,
        ref: "ParteApple",
    }, ],
    valorMO: {
        type: Number,
        required: false,
    },
    valorFlete: {
        type: Number,
        required: false,
    },
    valorTotal: {
        type: Number,
        required: false,
    },
    aprobado: {
        type: Boolean,
        required: false,
    },
    fechaAprob: {
        type: Date,
        required: false,
    },
    modificado: {
        type: Date,
        required: false,
    },
    creado: {
        type: Date,
        required: false,
    },
}, { versionKey: false });

presupuestoSchema.plugin(uniqueValidator, {
    message: "{Numero de presupuesto debe de ser unico}",
});

module.exports = mongoose.model("Presupuesto", presupuestoSchema);