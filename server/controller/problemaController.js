const Problema = require("../models/problemaModel");

const { QueryOpts } = require("../controller/dbconfig");

let listar = (req, res) => {
    Problema.find({ estado: true }, "-estado")
        .sort("descripcion")
        .exec((err, problemas) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                problemas,
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

    Problema.findById(id, (err, problemaDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!problemaDB) {
            return res.json({
                ok: false,
                err: {
                    message: "El ID no es correcto",
                },
            });
        }

        res.json({
            ok: true,
            problema: problemaDB,
        });
    });
};

let crear = (req, res) => {
    let body = req.body;
    let problema = new Problema({
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
        creada: Date.now(),
    });

    problema.save((err, problemaDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }
        if (!problemaDB) {
            return res.json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            problema: problemaDB,
        });
    });
};

let actualizar = (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descProblema = {
        descripcion: body.descripcion,
    };

    Problema.findByIdAndUpdate(id, descProblema, QueryOpts, (err, problemaActualizada) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!problemaActualizada) {
            return res.json({
                ok: false,
                err: {
                    message: "Problema No encontrada",
                },
            });
        }

        res.json({
            ok: true,
            problema: problemaActualizada,
        });
    });
};

let eliminar = (req, res) => {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    Problema.findByIdAndUpdate(id, cambiaEstado, QueryOpts, (err, problemaBorrada) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!problemaBorrada) {
            return res.json({
                ok: false,
                err: {
                    message: "El ID no existe",
                },
            });
        }

        res.json({
            ok: true,
            problema: problemaBorrada,
        });
    });
};

let buscar = (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, "i");

    Problema.find({
        $or: [{ descripcion: regex }],
    }).exec((err, problema) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (Object.entries(problema).length === 0) {
            return res.json({
                ok: false,

                message: "No se encontraron registros",
            });
        }

        res.json({
            ok: true,
            problema,
        });
    });
};

let catProblema = (req, res) => {
    Problema.aggregate([{ $unwind: "$categoria" }, { $group: { _id: "$categoria" } }])
        .sort({ _id: "asc" })
        .collation({ locale: "en", strength: 1 })
        .exec(function(err, categorias) {
            if (err) {
                return res.json(err);
            }
            res.json({
                categorias,
            });
        });
};

let mostrarPorCat = (req, res) => {
    let categoria = req.query.categoria;

    if (categoria.length === 0) {
        return res.json({
            ok: false,
            message: "Categoria requerida",
        });
    }

    Problema.find({
        $or: [{ categoria: categoria }],
    }).exec((err, problema) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (Object.entries(problema).length === 0) {
            return res.json({
                ok: false,

                message: "No se encontraron registros",
            });
        }

        res.json({
            ok: true,
            problema,
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
    catProblema,
    mostrarPorCat,
};