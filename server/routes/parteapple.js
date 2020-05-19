const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

const _ = require("underscore");

let app = express();
const ParteApple = require("../models/parteapple");

// ===============================
// Mostrar todas las partes
// ===============================

app.get("/parteapple", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    ParteApple.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("numParte")
        .populate("categoria", "descripcion")

    .exec((err, parteApple) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            parteApple,
        });
    });
});

// ===============================
// Mostrar una parte por ID
// ===============================
app.get("/parteapple/:id", verificaToken, (req, res) => {
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

    ParteApple.findById(id)
        .populate("categoria", "descripcion")
        .exec((err, parteAppleDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!parteAppleDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID no existe",
                    },
                });
            }

            res.json({
                ok: true,
                parteAppleDB,
            });
        });
});

// =======================================================
// Buscar una parte por descripcion, numero de parte o SKU
// =======================================================
app.get("/parteapple/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    termino = termino.toUpperCase();

    ParteApple.find({
            $or: [{ descripcion: regex }, { numParte: regex }, { sku: regex }],
        })
        .populate("categoria", "descripcion")
        .exec((err, partesApple) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(partesApple).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: "No se encontraron Partes",
                });
            }

            res.json({
                ok: true,
                partesApple,
            });
        });
});

// ===============================
// Agregar una parte
// ===============================
app.post("/parteapple", verificaToken, function(req, res) {
    let body = req.body;

    let parteApple = new ParteApple({
        numParte: body.numParte,
        descripcion: body.descripcion,
        sku: body.sku,
        precioStock: body.precioStock,
        precioExchange: body.precioExchange,
        precioCore: body.precioCore,
        precioRegular: body.precioRegular,
        categoria: body.categoria,
        bateria: body.bateria,
        retornable: body.retornable,
        img: "No Image",
    });

    parteApple.save((err, parteAppleDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!parteAppleDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            parteApple: parteAppleDB,
        });
    });
});

// ===============================
// Actualizar una parte
// ===============================
app.put("/parteapple/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, [
        "descripcion",
        "categoria",
        "sku",
        "precioStock",
        "precioExchange",
        "precioCore",
        "precioRegular",
        "bateria",
        "retornable",
        "img",
    ]);

    ParteApple.findByIdAndUpdate(
        id,
        body, { new: true, runValidators: true, useFindAndModify: false },
        (err, parteActualizada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!body) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Parte No encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                Parte: parteActualizada,
            });
        }
    );
});

// ===============================
// Borrar una Parte
// ===============================
app.delete("/parteapple/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false,
    };

    ParteApple.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, parteBorrada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "ID invalido",
                    },
                });
            }

            if (!parteBorrada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Parte No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                parte: parteBorrada,
            });
        }
    );
});

module.exports = app;