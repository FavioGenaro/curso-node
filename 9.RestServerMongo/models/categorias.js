const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'], // siempre es obligatorio
        unique: true
    },
    estado: { // para saber si esta borrado o no
        type: Boolean,
        default: true, // por defecto es true
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId, // va a ser un objeto que tenga el objeto, que lo sacamos de un modelo
        ref: 'Usuario', // debe ser del tipo usuario
        required: true
    }
});

// quitamos las variables de __v y estado de lo que se muestre en la respuesta
CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Categoria', CategoriaSchema );