
// extraemos el esquema y el modelo
const {Schema, model} = require('mongoose')

const UsuarioShema = Schema({ // Shema define cada uno de los campos del usuario
    nombre:{
        type: String,
        // el nombre es requerido
        required: [true, 'El nombre es obligatorio'] // podemos pasar solo true, pero tmb nos permite pasar un mensaje de error
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true // el correo no debe repetirse
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img:{
        type: String
    },
    rol: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        // enum: ['ADMIN_ROLE','USER_ROLE'] // restringe el valor para sea solo uno de esos dos valores
    },
    estado:{
        type: Boolean,
        default: true // valor por defecto
    },
    google:{
        type: Boolean,
        default: false
    },
});

// reescribimos el metodo toJSON
UsuarioShema.methods.toJSON = function () { // debe ser una función normal porque el this mantiene la referencia en la misma función.
    // this.toObject() crear una instancia del modelo
    // extraemos el _id
    const { __v, password,_id, ...usuario  } = this.toObject(); // destructuramos, sacamos el _v(versión) y el password, el resto de valores lo tiene usuario
    usuario.uid = _id; // creamos el uid con el valor de _id
    return usuario; // solo retornamos usuario
}

// exportamos el model; este pide el nombre de la colección, que es Usuario (mongosse añade la s al final del nombre) y pide tmb el shema
module.exports = model('Usuario', UsuarioShema);
