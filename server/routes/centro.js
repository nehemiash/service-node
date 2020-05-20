const express = require("express");

let {
    verificaToken,
    verificaAdmin_Role,
} = require("../middlewares/autenticacion");

let app = express();

const Centro = require("../models/centro");

// ===============================
// Mostrar centro
// ===============================
app.get("/centro", verificaToken, (req, res) => {
    Centro.find({ activo: true })
        .sort("nombre")
        .exec((err, centro) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                centro,
            });
        });
});

//===============================
// Crear una catergoria
// //===============================
app.post("/centro", [verificaToken, verificaAdmin_Role], function(req, res) {
    let body = req.body;
    let centro = new Centro({
        nombre: body.nombre,
        direccion: body.direccion,
        telefono: body.telefono,
        mail: body.mail,
        website: body.website,
        img: "logo.jpg",
        activo: true,
    });

    centro.save((err, centroDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }
        if (!centroDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            centro: centroDB,
        });
    });
});

// //===============================
// // Actualizar informacion centro
// //===============================
app.put("/centro/:id", [verificaToken, verificaAdmin_Role], function(
    req,
    res
) {
    let id = req.params.id;
    let body = req.body;

    let centroInfo = {
        nombre: body.nombre,
        direccion: body.direccion,
        telefono: body.telefono,
        mail: body.mail,
        website: body.website,
        img: body.img,
    };

    Centro.findByIdAndUpdate(
        id,
        centroInfo, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
            context: "query", // esta opcion es para que reemplace un valor unique
        },
        (err, centroAct) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!centroAct) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Centro No encontrada",
                    },
                });
            }

            res.json({
                ok: true,
                Centro: centroAct,
            });
        }
    );
});

// //===============================
// // Eliminar una catergorias
// //===============================
app.delete("/centro/:id", [verificaToken, verificaAdmin_Role], function(
    req,
    res
) {
    let id = req.params.id;

    let cambiaEstado = {
        activo: false,
    };

    Centro.findByIdAndUpdate(
        id,
        cambiaEstado, { new: true, useFindAndModify: false },
        (err, centroBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err,
                });
            }

            if (!centroBorrado) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Centro no encontrado",
                    },
                });
            }

            res.json({
                ok: true,
                centro: centroBorrado,
            });
        }
    );
});

module.exports = app;