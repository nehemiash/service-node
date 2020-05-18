const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

const Consolidacion = require("../models/consolidacion");

const _ = require("underscore");

// ==================================
// Mostrar todas las consolidaciones
// ==================================
const app = express();
app.get("/consolidacion", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Consolidacion.find({ activo: true })
        .skip(desde)
        .limit(limite)
        .sort("numero")
        //    .populate("Kbb", "numParte ")

    .exec((err, consolidaciones) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            consolidaciones,
        });
    });
});

// ===============================
// Mostrar una consolidacion por ID
// ===============================
app.get("/consolidacion/:id", verificaToken, (req, res) => {
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

    Consolidacion.findById(id)
        //    .populate("categoria", "descripcion")
        .exec((err, consolidacionDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!consolidacionDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID no existe",
                    },
                });
            }

            res.json({
                ok: true,
                consolidacionDB,
            });
        });
});

// ===============================
// Buscar una consolidacion
// ===============================
app.get("/consolidacion/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    Consolidacion.find({
            $or: [{ numero: termino }, { guia: termino }],
        })
        //    .populate("Kbb", "numparte")
        .exec((err, consolidaciones) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(consolidaciones).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: "No se encontraron consolidaciones",
                });
            }

            res.json({
                ok: true,
                consolidaciones,
            });
        });
});

// ===============================
// Crear un consolidacion
// ===============================
app.post("/consolidacion", verificaToken, function(req, res) {
    let body = req.body;

    let consolidacion = new Consolidacion({
        numero: body.numero,
        guia: body.guia,
        courier: body.courier,
        fecha: Date.now(),
        cantidad: body.cantidad,
        valor: body.valor,
        cobertura: body.cobertura,
        lista: body.lista,
        peso: body.peso,
        dimensiones: body.dimensiones,
    });

    consolidacion.save((err, consolidacionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!consolidacionDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            consolidacion: consolidacionDB,
        });
    });
});

// ===============================
// Actualizar un consolidacion
// ===============================
app.put("/consolidacion/:id", [verificaToken], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, [
        "numero",
        "guia",
        "courier",
        "estado",
        "fecha",
        "cantidad",
        "valor",
        "cobertura",
        "lista",
        "peso",
        "dimensiones",
        "completado",
        "activo",
    ]);

    Consolidacion.findByIdAndUpdate(
        id,
        body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
            context: "query", // esta opcion es para que reemplace un valor unique
        },
        (err, conlidacionAct) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                usuario: conlidacionAct,
            });
        }
    );
});

// ===============================
// Borrar un consolidacion
// ===============================
app.delete("/consolidacion/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        activo: false,
    };

    Consolidacion.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, consolidacionBorrada) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "ID invalido",
                    },
                });
            }

            if (!consolidacionBorrada) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Consolidacion No encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                consolidacion: consolidacionBorrada,
            });
        }
    );
});

module.exports = app;