const Nota = require("../models/notaModel");

const { QueryOpts } = require("../controller/dbconfig");

let listar = (req, res) => {
    let pagina = Number(req.query.pagina) || 1;
    let limite = Number(req.query.limite) || 15;

    let skip = pagina - 1;
    skip = skip * limite;
    let total_paginas;
    let total_notas;

    Nota.countDocuments({ estado: true }, (err, numOfDocs) => {
        if (err) throw err;
        total_paginas = Math.ceil(numOfDocs / limite);
        total_notas = numOfDocs;
    });

    Nota.find({ estado: true }, "-estado")
        .skip(skip)
        .limit(limite)
        .sort("creada")
        .populate("usuario", "nombre -_id")
        //.populate("orden", "numero -_id")
        .exec((err, notas) => {
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
                total_notas,
                notas,
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

    Nota.findById(id, (err, notaDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!notaDB) {
            return res.json({
                ok: false,
                err: {
                    message: "El ID no es correcto",
                },
            });
        }

        res.json({
            ok: true,
            nota: notaDB,
        });
    }).populate("usuario", "nombre -_id");
    //.populate("orden", "numero -_id")
};

let crear = (req, res) => {
    let body = req.body;
    let nota = new Nota({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        tipo: body.tipo,
        creada: Date.now(),
        orden: body.orden,
    });

    nota.save(async(err, notaDB) => {
        await nota.populate("usuario", "nombre -_id").execPopulate();
        // await nota.populate("orden", "numero").execPopulate();

        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }
        if (!notaDB) {
            return res.json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            nota: notaDB,
        });
    });
};

let actualizar = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descNota = {
        descripcion: body.descripcion,
    };

    Nota.findByIdAndUpdate(id, descNota, QueryOpts, (err, notaActualizada) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!notaActualizada) {
            return res.json({
                ok: false,
                err: {
                    message: "Nota No encontrada",
                },
            });
        }

        res.json({
            ok: true,
            nota: notaActualizada,
        });
    });
};

let eliminar = (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    Nota.findByIdAndUpdate(id, cambiaEstado, QueryOpts, (err, notaBorrada) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!notaBorrada) {
            return res.json({
                ok: false,
                err: {
                    message: "El ID no existe",
                },
            });
        }

        res.json({
            ok: true,
            message: "Nota Borrada",
            nota: notaBorrada,
        });
    });
};

let buscar = (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Nota.find({ estado: true, $or: [{ descripcion: regex }] }).exec((err, nota) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (Object.entries(nota).length === 0) {
            return res.json({
                ok: false,

                message: "No se encontraron registros",
            });
        }

        res.json({
            ok: true,
            nota,
        });
    });
};

module.exports = {
    listar,
    mostrarPorId,
    crear,
    actualizar,
    eliminar,
    buscar,
};