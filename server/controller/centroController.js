const Centro = require("../models/centroModel");

const _ = require("underscore");

const { QueryOpts } = require("../controller/dbconfig");

let listar = (req, res) => {
    Centro.find({ activo: true })
        .sort("nombre")
        .exec((err, centro) => {
            if (err) {
                return res.json({
                    ok: false,
                    err,
                });
            }
            res.json({
                ok: true,
                centro,
            });
        });
};

let crear = (req, res) => {
    let body = req.body;
    let centro = new Centro({
        nombre: body.nombre,
        direccion: body.direccion,
        telefono: body.telefono,
        mail: body.mail,
        site: body.website,
        img: body.img,
    });

    centro.save((err, centroDB) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }
        if (!centroDB) {
            return res.json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            centro: centroDB,
        });
    });
};

let actualizar = (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "direccion", "telefono", "mail", "site", "img"]);

    Centro.findByIdAndUpdate(id, body, QueryOpts, (err, centroAct) => {
        if (err) {
            return res.json({
                ok: false,
                err,
            });
        }

        if (!centroAct) {
            return res.json({
                ok: false,
                err: {
                    message: "Centro no encontrado",
                },
            });
        }

        res.json({
            ok: true,
            centro: centroAct,
        });
    });
};

module.exports = {
    listar,
    crear,
    actualizar,
};