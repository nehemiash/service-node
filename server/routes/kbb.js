const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

const Kbb = require("../models/kbb");

const _ = require("underscore");

// ==================================
// Mostrar todos los KBB pendientes
// ==================================
const app = express();
app.get("/kbb", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Kbb.find({ activo: true })
        .populate(
            "parteapple",
            "descripcion numParte bateria retornable sku precioCore"
        )
        .populate("notas", "descripcion")
        .skip(desde)
        .limit(limite)
        // .sort("sro") // buscar como hacer sort en este campo, viende desde otro documento

    .exec((err, kbbs) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            kbbs,
        });
    });
});

// ===============================
// Mostrar un kbb por el ID
// ===============================
app.get("/kbb/:id", verificaToken, (req, res) => {
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

    Kbb.findById(id)
        .populate(
            "parteapple",
            "descripcion numParte bateria retornable sku precioCore"
        )
        .populate("notas", "descripcion")
        .exec((err, kbbDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!kbbDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID no existe",
                    },
                });
            }

            res.json({
                ok: true,
                kbbDB,
            });
        });
});

// ===============================
// Buscar un kbb
// ===============================
app.get("/kbb/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    // consultar como buscar sro viene id de otra tabla
    // o por numero de parte tambien viene de otra tabla
    Kbb.find({
            $or: [
                { kbb: termino },
                { kgb: termino },
                { guiaExp: termino },
                { guiaImp: termino },
            ],
        })
        .populate(
            "parteapple",
            "descripcion numParte bateria retornable sku precioCore"
        )
        .populate("notas", "descripcion")
        .exec((err, kbbDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(kbbDB).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: "No se encontraron kbbDB",
                });
            }

            res.json({
                ok: true,
                kbbDB,
            });
        });
});

// ===============================
// Crear un kbb
// ===============================
app.post("/kbb", verificaToken, function(req, res) {
    let body = req.body;

    let kbb = new Kbb({
        sro: body.sro,
        parteapple: body.parteapple,
        kbb: body.kbb,
        kgb: body.kgb,
        guiaImp: body.guiaImp,
        guiaExp: body.guiaExp,
        reposicionStock: body.reposicionStock,
        cobertura: body.cobertura,
        creado: Date.now(),
    });

    kbb.save((err, kbbDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!kbbDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            kbb: kbbDB,
        });
    });
});

// ===============================
// Actualizar un consolidacion
// ===============================
app.put("/kbb/:id", [verificaToken], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, [
        "sro",
        "parte",
        "kbb",
        "kgb",
        "guiaImp",
        "guiaExp",
        "consolidado",
        "consolidacion",
        "reposicionStock",
        "estado",
        "notas",
        "cobertura",
    ]);

    Kbb.findByIdAndUpdate(
            id,
            body, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
                context: "query", // esta opcion es para que reemplace un valor unique
            },
            (err, kbbAct) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err,
                    });
                }

                res.json({
                    ok: true,
                    kbb: kbbAct,
                });
            }
        )
        .populate(
            "parteapple",
            "descripcion numParte bateria retornable sku precioCore"
        )
        .populate("notas", "descripcion");
});

// ===============================
// Borrar un consolidacion
// ===============================
app.delete("/kbb/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        activo: false,
    };

    Kbb.findByIdAndUpdate(
            id,
            cambiaEstado, { new: true, useFindAndModify: false },
            (err, kbbBorrado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: "ID invalido",
                        },
                    });
                }

                if (!kbbBorrado) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: "Consolidacion No encontrada",
                        },
                    });
                }

                res.json({
                    ok: true,
                    consolidacion: kbbBorrado,
                });
            }
        )
        .populate(
            "parteapple",
            "descripcion numParte bateria retornable sku precioCore"
        )
        .populate("notas", "descripcion");
});

module.exports = app;