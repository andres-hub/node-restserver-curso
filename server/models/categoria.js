const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema
let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        //si tiene esta propiedad no se puede modicicar 
        unique: true
    },
    descripcion: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

categoriaSchema.plugin(uniqueValidator, { messaga: '{PATH} debe ser unico' })

module.exports = mongoose.model('Categoria', categoriaSchema)