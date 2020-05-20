const express = require("express");

let { verificaToken } = require("../middlewares/autenticacion");

let app = express();

const Presupuesto = require("../models/presupuesto");

// ===============================
// Mostrar todas las categorias
// ===============================
app.get("/presupuesto", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Presupuesto.find({ activo: true })
        .skip(desde)
        .limit(limite)
        .sort("creado")
        .populate("stock", "codigo descripcion precio")
        .populate("parteapple", "numParte descripcion precioRegular")
        .exec((err, presupuestos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                presupuestos,
            });
        });
});

// //===============================
// // Mostrar una nota por ID
// //===============================
app.get("/presupuesto/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    // para validar si el ID ingresado es correcto
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "ID incorrecto",
            },
        });
    }

    Presupuesto.findById(id)
        .populate("stock", "codigo descripcion precio")
        .populate("parteapple", "numParte descripcion precioRegular")
        .exec((err, presupuestoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!presupuestoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "El ID no es correcto",
                    },
                });
            }

            res.json({
                ok: true,
                presupuesto: presupuestoDB,
            });
        });
});

//===============================
// Crear una presupuesto
// //===============================
app.post("/presupuesto", verificaToken, function(req, res) {
    let body = req.body;
    let presupuesto = new Presupuesto({
        numero: body.numero,
        stock: body.stock,
        parteapple: body.parteapple,
        valorMO: body.valorMO,
        valorFlete: body.valorFlete,
        valorTotal: body.valorTotal,
        aprobado: false,
        modificado: Date.now(),
        creado: Date.now(),
        activo: true,
    });

    presupuesto.save((err, presupuestoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!presupuestoDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            presupuesto: presupuestoDB,
        });
    });
});

// //===============================
// // Actualizar una presupuesto
// //===============================
app.put("/presupuesto/:id", verificaToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let actPresupuesto = {
        stock: body.stock,
        parteapple: body.parteapple,
        valorMO: body.valorMO,
        valorFlete: body.valorFlete,
        valorTotal: body.valorTotal,
        aprobado: body.aprobado,
        modificado: Date.now(),
    };

    Presupuesto.findByIdAndUpdate(id, actPresupuesto, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })
        .populate("stock", "codigo descripcion precio")
        .populate("parteapple", "numParte descripcion precioRegular")
        .exec((err, presupuestoAct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!presupuestoAct) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Presupuesto No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                presupuesto: presupuestoAct,
            });
        });
});

// //===============================
// // Eliminar una catergorias
// //===============================
app.delete("/categoria/:id", [verificaToken], function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        activo: false,
    };

    Presupuesto.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, presupuestoBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!presupuestoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Cliente No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                presupuesto: presupuestoBorrado,
            });
        }
    );
});

module.exports = app;