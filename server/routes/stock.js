const express = require("express");

const { verificaToken } = require("../middlewares/autenticacion");

const _ = require("underscore");

let app = express();
const Stock = require("../models/stock");

// ===============================
// Mostrar todos los items
// ===============================

app.get("/stock", verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Stock.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort("decripcion")
        .populate("categoria", "descripcion")

    .exec((err, stockDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        res.json({
            ok: true,
            stockDB,
        });
    });
});

// ===============================
// Mostrar un item por ID
// ===============================
app.get("/stock/:id", verificaToken, (req, res) => {
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

    Stock.findById(id)
        .populate("categoria", "descripcion")
        .exec((err, stockDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!stockDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "ID no existe",
                    },
                });
            }

            res.json({
                ok: true,
                stockDB,
            });
        });
});

// ==============================================================
// Buscar un item por la descripcion, referencia
// ==============================================================
app.get("/stock/buscar/:termino", verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Stock.find({
            $or: [{ descripcion: regex }, { referencia: regex }],
        })
        .populate("categoria", "descripcion")
        .exec((err, stock) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(stock).length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: "No se encontraron items",
                });
            }

            res.json({
                ok: true,
                stock,
            });
        });
});

// ===============================
// Agregar un item
// ===============================
app.post("/stock", verificaToken, function(req, res) {
    let body = req.body;

    let stock = new Stock({
        codigo: body.codigo,
        descripcion: body.descripcion,
        marca: body.marca,
        categoria: body.categoria,
        referencia: body.referencia,
        precio: body.precio,
        cantidad: body.cantidad,
        cobertura: body.cobertura,
        stokmin: body.stockmin,
        img: "No Image",
    });

    stock.save((err, stockDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!stockDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            stock: stockDB,
        });
    });
});

// ===============================
// Actualizar un item
// ===============================
app.put("/stock/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, [
        "codigo",
        "descripcion",
        "marca",
        "categoria",
        "referencia",
        "precio",
        "cobertura",
        "stockmin",
        "img",
    ]);

    Stock.findByIdAndUpdate(
        id,
        body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
            context: "query", // esta opcion es para que reemplace un valor unique
        },
        (err, stockAct) => {
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
                        message: "Item No encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                item: stockAct,
            });
        }
    );
});

// ===============================
// Borrar un item
// ===============================
app.delete("/stock/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        disponible: false,
    };

    Stock.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, itemBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "ID invalido",
                    },
                });
            }

            if (!itemBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Item No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                item: itemBorrado,
            });
        }
    );
});

// ===============================
// Actualizar Cantidad
// ===============================
app.put("/stock/act/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    Stock.findById(id).exec((err, stockDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!stockDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "ID no existe",
                },
            });
        }

        let valorAct = (stockDB.cantidad -= 1);

        let cambiaCantidad = {
            cantidad: valorAct,
        };

        Stock.findByIdAndUpdate(
            id,
            cambiaCantidad, { new: true, useFindAndModify: false },
            (err, itemActualizado) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: "ID invalido",
                        },
                    });
                }

                res.json({
                    ok: true,
                    item: itemActualizado,
                });
            }
        );
    });
});

module.exports = app;