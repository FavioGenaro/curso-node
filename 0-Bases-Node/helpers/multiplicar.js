
const fs = require('fs'); // traemos el modulo fs

const crearArchivo = async (base = 5) =>{ // el 5 es su valor por defecto si no establecemos un valor a la función cuando la llamamos
    // let salida = '';
    
    // for(let i = 0; i<10;i++){
    //     salida += `${base} x ${i+1} = ${base*(i+1)}\n`;
    // }

    // fs.writeFileSync(`tabla-${base}.txt`,salida);
    // console.log(`tabla-${base}.txt`);

    // Lo volvemos una promesa
    // return new Promise ((resolve, reject) =>{
    //     let salida = '';
        
    //     for(let i = 0; i<10;i++){
    //         salida += `${base} x ${i+1} = ${base*(i+1)}\n`;
    //     }

    //     fs.writeFileSync(`tabla-${base}.txt`,salida);
    //     resolve(`tabla-${base}.txt`);
    // })

    // usando async await
    // En este metodo si algo da un error no puedo usar el reject, por lo que uso un try catch
    try {
        let salida = '';
        
        for(let i = 0; i<10;i++){
            salida += `${base} x ${i+1} = ${base*(i+1)}\n`;
        }

        fs.writeFileSync(`tabla-${base}.txt`,salida);
        return `tabla-${base}.txt`;
    } catch (err) {
        throw err; // lanzar una excepción después de cogerla
    }
}

//  de esta forma exportamos un objeto
module.exports = {
    // podemos hacerlos de la sgte forma, en este caso el nombre con el que aparecera en el resto es funcion
    // function:crearArchivo,
    // de esta forma mantemos el mismo nombre para poder reconocerlo
    // crearArchivo:crearArchivo,
    // pero como es del mismo nombre podemos solo colocar el nombre y se sobre entiende que sera lo mismo que la linea anterior
    crearArchivo
}