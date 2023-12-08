const { response } = require("express")

const validarArchivoSubir = (req, res = response, next ) => {

    // verificamos si viene el files
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        });
    }

    next(); // para qie continue con el siguiente middleware

}
module.exports = {
    validarArchivoSubir
}