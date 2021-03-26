const Repuesto = require("../models/repuestoModel");
const _ = require("underscore");
const { QueryOpts } = require("../controller/dbconfig");

let listar = (req, res) => {
    let pagina = Number(req.query.pagina) || 1;
    let limite = Number(req.query.limite) || 15;
    let sort = req.query.sort || "descripcion";

    let skip = pagina - 1;
    skip = skip * limite;
    let total_paginas;
    let total_repuesto;

    Repuesto.countDocuments({ estado: true }, (err, numOfDocs) => {
        if (err) throw err;
        total_paginas = Math.ceil(numOfDocs / limite);
        total_repuesto = numOfDocs;
    });

    Repuesto.find({ estado: true })
        .skip(skip)
        .limit(limite)
        .populate("categoria", "descripcion")
        .sort(sort)
        .exec((err, repuestos) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                pagina,
                total_paginas,
                total_repuesto,
                repuestos,
            });
        });
};

let mostrarPorId = (req, res) => {
    let id = req.params.id;

    // para validar si el ID ingresado es correcto
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.json({
            ok: false,
            err: {
                message: "ID incorrecto",
            },
        });
    }

    Repuesto.findById(id)
        .populate("categoria", "descripcion")
        .exec((err, repuestoDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }

            if (!repuestoDB) {
                return res.json({
                    ok: false,
                    err: {
                        message: "ID no existe",
                    },
                });
            }

            res.json({
                ok: true,
                repuestoDB,
            });
        });
};

let buscar = (req, res) => {
    let termino = req.params.termino;
    let pagina = Number(req.query.pagina) || 1;
    let limite = Number(req.query.limite) || 15;

    let skip = pagina - 1;
    skip = skip * limite;

    let total_paginas;
    let total_repuesto;

    Repuesto.countDocuments({ estado: true }, (err, numOfDocs) => {
        if (err) throw err;
        total_paginas = Math.ceil(numOfDocs / limite);
        total_repuesto = numOfDocs;
    });

    let regex = new RegExp(termino, "i");

    Repuesto.find({ estado: true, $or: [{ descripcion: regex }, { numParte: termino }] })
        .skip(skip)
        .limit(limite)
        .populate("categoria", "descripcion")
        .sort("descripcion")
        .exec((err, repuestos) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }

            if (Object.entries(repuestos).length === 0) {
                return res.json({
                    ok: false,
                    message: "No se encontraron Repuestos",
                });
            }

            res.json({
                ok: true,
                pagina,
                total_paginas,
                total_repuesto,
                repuestos,
            });
        });
};

let crear = async(req, res) => {
    let body = req.body;

    let codigo;

    // trae el ultimo registro de la DB
    let ultimo = await Repuesto.find({}, "-_id codigo").sort({ $natural: -1 }).limit(1).exec();

    // convierte a numero e incrementa
    if (ultimo.length > 0) {
        ultimo = ultimo.toString(); // convierte el objeto a string
        ultimo = parseInt(ultimo.replace(/\D/g, ""));
        codigo = ultimo + 1;
    }

    // si no hay ultimo registro comienza en 1
    if (ultimo.length === 0) {
        codigo = 1;
    }

    let repuesto = new Repuesto({
        codigo: codigo,
        descripcion: body.descripcion,
        marca: body.marca,
        numParte: body.numParte,
        categoria: body.categoria,
        stockMin: body.stockMin,
        precioCosto: body.precioCosto,
        precioVenta: body.precioVenta,
    });

    repuesto.save((err, repuestoDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }
        if (!repuestoDB) {
            return res.json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            repuestoDB,
        });
    });
};

let actualizar = (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [
        "descripcion",
        "marca",
        "numParte",
        "categoria",
        "stockMin",
        "precioCosto",
        "precioVenta",
    ]);

    Repuesto.findByIdAndUpdate(id, body, QueryOpts, (err, repuestoAct) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!repuestoAct) {
            return res.json({
                ok: false,
                err: {
                    message: "Repuesto No encontrado",
                },
            });
        }

        res.json({
            ok: true,
            Repuesto: repuestoAct,
        });
    });
};

let eliminar = (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    Repuesto.findByIdAndUpdate(id, cambiaEstado, QueryOpts, (err, repuestoBorrado) => {
        if (err) {
            return res.json({
                ok: false,
                err: {
                    message: "ID invalido",
                },
            });
        }

        if (!repuestoBorrado) {
            return res.json({
                ok: false,
                err: {
                    message: "Repuesto No encontrado",
                },
            });
        }

        res.json({
            ok: true,
            repuesto: repuestoBorrado,
        });
    });
};

let marcas = (req, res) => {
    Repuesto.aggregate([{ $unwind: "$marca" }, { $group: { _id: "$marca" } }])
        .sort({ _id: "asc" })
        .collation({ locale: "en", strength: 1 })
        .exec(function(err, marcas) {
            if (err) {
                return res.json(err);
            }
            res.json({
                marcas,
            });
        });
};

module.exports = {
    listar,
    mostrarPorId,
    buscar,
    crear,
    actualizar,
    eliminar,
    marcas,
};