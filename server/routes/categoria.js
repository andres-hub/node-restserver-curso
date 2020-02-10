const express = require('express')
const _ = require('underscore')
let { verificaToken, verificaRol } = require('../middlewares/autenticacion')
let Categoria = require('../models/categoria')
let app = express()

//=============================
//Mostar todas las categorias 
//=============================
app.get('/categoria', verificaToken, (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 50
    limite = Number(limite)
    Categoria.find({ estado: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .skip(desde).limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.estimatedDocumentCount((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({ ok: true, categorias, cuantas: conteo })
            })

        })
});
//=============================
//Mostrar una categoria
//=============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Categoria.findById(id).exec((err, cotegoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            cotegoria
        })
    })
});

//=============================
//Crear nueva categoria
//=============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })
    categoria.save((err, categoriaDB) => {
        if (err) {
            if (err.errors.nombre.kind == 'unique') {
                return res.status(500).json({
                    ok: false,
                    err: { menssage: "La categoria " + categoria.nombre + "ya existe" }
                })
            }
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err })
        }
        res.json({ ok: true, categoria: categoriaDB })
    })
});
//=============================
//Actualizar una categoria
//=============================
app.put("/categoria/:id", [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'descripcion', 'estado'])

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err })
        }
        if (!categoriaDB) {
            return res.status(400).json({ ok: false, err })
        }
        res.json({ ok: true, categoria: categoriaDB })
    })
});
//=============================
//Borrar Categoria 
//=============================
app.delete('/categoria/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { menssagr: 'Id de categoria no existe' }
            })
        }
        res.json({ ok: true, categotria: categoriaDB, menssage: 'categoria borrada' })
    })

});

module.exports = app