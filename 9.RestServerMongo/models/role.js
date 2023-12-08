const { Schema, model } = require('mongoose'); // importamos algunas funciones de mongoose

const RoleSchema = Schema({ // Shema define cada uno de los campos del usuario
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'] // el rol es obligatorio
    }
});

// exportamos el model; este pide el nombre de la colección, que es Role (mongosse añade la s al final del nombre siendo roles) y pide tmb el shema
module.exports = model( 'Role', RoleSchema );