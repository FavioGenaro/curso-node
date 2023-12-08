// const fs = require('fs'); // traemos el modulo fs

// importamos una función desde un archivo externo
const{ crearArchivo} = require('./helpers/multiplicar') // destructuramos la función
const argv = require('yargs').argv // importa el paquete, especificamente el argv del paquete

// console.log(process.argv)
console.log(argv)
console.log('base: yargs',argv.base)

// console.clear(); // limpia la consola

// console.log(process.argv);//muestra los argumentos que vienen de la consola
// const [,,arg3 = 'base=5'] = process.argv; //detructuramos y cogemos el 3er argumento, además le añadimos un valor por defecto

// const [, base = 5] = arg3.split('='); // destructuramos y el segundo valor vendria a ser el numero (parte en dos el arreglo separados por el =)
// console.log(base)




// let salida = '';
// const base = 5;
// for(let i = 0; i<10;i++){
//     salida += `${base} x ${i+1} = ${base*(i+1)}\n`;
// }

// writeFile escribe en un archivo, si no existe lo crea
// el primero es es path, que si no lo pondemos, se ejecuta sobre el mismo archivo
// el segundo son los datos que vamos a escribir en el archivo
// el tercero es un callback, que se ejecuta al final (luego de creado el archivo)
// fs.writeFile(`tabla-${base}.txt`,salida, (err) => {
//     if (err) throw err; // por si hay un error lo muestra

//     console.log('tabla-5.txt creado');// si se imprime esto, es que todo esta bien
// })


// Usando el writeFileSync, solo necesitamos los dos primeros parametros del writeFile
// este se ejecuta de forma asincrona
// En caso de querer capturar el error, tendriamos que usar try catch
// fs.writeFileSync(`tabla-${base}.txt`,salida);
// console.log(`tabla-${base}.txt`);

// const base = 4;
// crearArchivo(base)
// crearArchivo(base) // retorna el nombre del archivo en el resolve, por lo que la variable nombreArchivo toma ese valor 
//     .then(nombreArchivo => console.log(nombreArchivo,'creado'))
//     .catch(err => console.log(err)) // si hay un error
