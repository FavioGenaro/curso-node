const isLogged = (req, res, next)=>{ // petición, respuesta y next
    let logged = true; // cambia
    if(logged){ // si es true, da paso a la respuesta de la petición
        next(); // va dar paso a que se ejecute la respuesta del servidor, recodemos que se ejecuta depues de la petición y antes de que se mande la respuesta
    }else{ // si no esta logiado, debe enviar un mensaje
        res.send('No puede acceder, debe logiarse')
    }

}

// lo exportamo con el nombre isLogged = a la variable isLogget
exports.isLogged = isLogged;