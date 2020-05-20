const express = require("express");

let { verificaToken } = require("../middlewares/autenticacion");

let app = express();

const Sro = require("../models/sro");

// ===============================
// Mostrar todas las sros
// ===============================
app.get("/sro", verificaToken, (req, res) => {
    Sro.find({ activo: true })
        .sort("numero")
        .populate("kbb", "parteapple kbb kgb")
        .populate("nota", "descripcion")
        .exec((err, sros) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                sros,
            });
        });
});

// //===============================
// // Mostrar una sro por ID
// //===============================
app.get("/sro/:id", verificaToken, (req, res) => {
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

    Sro.findById(id)
        .populate("kbb", "parteapple kbb kgb")
        .populate("nota", "descripcion")
        .exec((err, sroDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!sroDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "El ID no es correcto",
                    },
                });
            }

            res.json({
                ok: true,
                sro: sroDB,
            });
        });
});

//===============================
// Crear una sro
// //===============================
app.post("/sro", verificaToken, function(req, res) {
    let body = req.body;
    let sro = new Sro({
        numero: body.numero,
        activo: true,
        numeroGSX: body.numeroGSX,
        creado: Date.now(),
        kbb: body.kbb,
        nota: body.nota,
        modificado: Date.now(),
    });

    sro.save((err, sroDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!sroDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            sro: sroDB,
        });
    });
});

// //===============================
// // Actualizar una sro
// //===============================
app.put("/sro/:id", verificaToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let sroAct = {
        numero: body.numero,
        numeroGSX: body.numeroGSX,
        kbb: body.kbb,
        nota: body.nota,
        modificado: Date.now(),
        completada: body.completada,
        cerrado: body.cerrado,
    };

    Sro.findByIdAndUpdate(id, sroAct, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
            context: "query", // esta opcion es para que reemplace un valor unique
        })
        .populate("kbb", "parteapple kbb kgb")
        .populate("nota", "descripcion")
        .exec((err, sroAct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!sroAct) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Sro No encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                sro: sroAct,
            });
        });
});

// //===============================
// // eliminar una sro
// //===============================
app.delete("/sro/:id", [verificaToken], function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        activo: false,
        cerrado: Date.now(),
        modificado: Date.now(),
    };

    Sro.findByIdAndUpdate(id, cambiaEstado, {
            new: true,
            useFindAndModify: false,
        })
        .populate("kbb", "parteapple kbb kgb")
        .populate("nota", "descripcion")
        .exec((err, sroCompletada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!sroCompletada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Sro No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                sro: sroCompletada,
            });
        });
});

// =======================================================
// Buscar una sro
// =======================================================
app.get("/sro/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Sro.find({
            $or: [{ numero: regex }, { numeroGSX: regex }],
        })
        .populate("kbb", "parteapple kbb kgb")
        .populate("nota", "descripcion")
        .exec((err, sro) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(sro).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: "No se encontro nada",
                });
            }

            res.json({
                ok: true,
                sro,
            });
        });
});

module.exports = app;