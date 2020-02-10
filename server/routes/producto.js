const express = require('express')
const _ = require('underscore')
let { verificaToken } = require('../middlewares/autenticacion')
let Producto = require('../models/producto')
let app = express();
//===============================
//Optener productos
//===============================
//traer todos los productos
//populate: usuarios y categorias
//Paguinado
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 50
    limite = Number(limite)
    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde).limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Producto.estimatedDocumentCount((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({ ok: true, productos, cuantos: conteo })
            })
        })
});


//===============================
//Optener productos Id
//===============================
//populate: usuarios y categorias
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: { menssage: 'Prodcuto no existe' }
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })
        })
});

//===============================
//Buscar productos
//===============================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex }).populate('categoria', 'nombre').exec((err, productos) => {
        if (err) {
            return res.status(500).json({ ok: false, err })
        }
        res.json({ ok: true, productos })
    })
});

//===============================
//Crear producto Id
//===============================
//grabar el usuario 
//grabar categoria
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save(producto, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err })
        }
        if (!productoDB) {
            return res.status(400).json({ ok: false, err })
        }
        res.json({ ok: true, producto: productoDB })
    });
});


//===============================
//Actualizar producto  Id
//===============================
//grabar el usuario 
//grabar categoria
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'categoria'])
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err })
        }
        if (!productoDB) {
            return res.status(400).json({ ok: false, err })
        }
        res.json({ ok: true, producto: productoDB })
    });
});

//===============================
//Borrar producto  Id liguico
//===============================
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let cambioEstado = { disponible: false }
    Producto.findByIdAndUpdate(id, cambioEstado, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({ ok: false, err })
        }
        if (!productoDB) {
            return res.status(400).json({ ok: false, err })
        }
        res.json({ ok: true, producto: productoDB })
    });
});

module.exports = app;