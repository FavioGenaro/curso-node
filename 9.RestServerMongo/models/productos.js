const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: { // no va a ser una dato obligatorio
        type: Number,
        default: 0 // valos por defecto de cero
    },
    categoria: {
        type: Schema.Types.ObjectId, // id de la categoria, vamos a usar .populate para extraer la data de la categoria
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String }, 
    disponible: { type: Boolean, defult: true }, // disponiblidad del producto, que no quiere decir que este elimado, para eso tenemos al estado
    img:{
        type: String
    },
});

// para extraer los datos que no queremos mostrar en la respuesta
ProductoSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Producto', ProductoSchema );