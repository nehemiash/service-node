const express = require("express");

let {
    verificaToken,
    verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

const Tecnico = require("../models/tecnico");

// ===============================
// Mostrar todos los tecnicos
// ===============================
app.get("/tecnico", verificaToken, (req, res) => {
    Tecnico.find({ estado: true })
        .populate("usuario", "nombre")
        .exec((err, tecnicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                tecnicos,
            });
        });
});

// //===============================
// // Mostrar un tecnico por ID
// //===============================
app.get("/tecnico/:id", verificaToken, (req, res) => {
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

    Tecnico.findById(id)
        .populate("usuario", "nombre")
        .exec((err, tecnicoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!tecnicoDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "El ID no es correcto",
                    },
                });
            }

            res.json({
                ok: true,
                tecnico: tecnicoDB,
            });
        });
});

//===============================
// Crear una tecnico
// //===============================

app.post("/tecnico", [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;

    let tecnico = new Tecnico({
        usuario: body.usuario,
        estado: true,
        creado: Date.now(),
    });

    tecnico.save((err, tecnicoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!tecnicoDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            tecnico: tecnicoDB,
        });
    });
});

// //===============================
// // Actualizar una tecnico
// //===============================
app.put("/tecnico/:id", [verificaToken, verificaAdmin_Role], function(
    req,
    res
) {
    let id = req.params.id;
    let body = req.body;

    let actTecnico = {
        estado: body.estado,
    };

    Tecnico.findByIdAndUpdate(
        id,
        actTecnico, { new: true, runValidators: true, useFindAndModify: false },
        (err, tecnicoAct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!tecnicoAct) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Tecnico No encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                tecnico: tecnicoAct,
            });
        }
    );
});

// //===============================
// // Eliminar una catergorias
// //===============================
app.delete("/tecnico/:id", [verificaToken, verificaAdmin_Role], function(
    req,
    res
) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: false,
    };

    Tecnico.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, tecnicoBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!tecnicoBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Cliente No encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                tecnico: tecnicoBorrado,
            });
        }
    );
});

module.exports = app;