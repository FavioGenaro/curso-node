require('dotenv').config(); // cargamos las variables de entorno

const express = require('express'); // importamos el modulo express 
const app = express(); // creamos la aplicacion 
// const port = 3000;
const port = process.env.PORT;// puerto que declaramos en las variables de entorno
const path = require('path'); // para el manejo de rutas

// handlebars
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/../views/partials');

app.set('view engine', 'hbs'); // decimos a express que renderice el html usando Handlebars

app.use(express.static(path.join(__dirname, 'public'))); // sirve el index.html en la ruta /

app.get('/',(req, res)=>{ 
    res.render('home',{// solo especificamos home porque hbs buscara en la carpeta views y los archivo .hbs, por eso a home ya no coloco la extensión
        nombre: 'Favio Saico', // esto es un objeto que es el argumento con los datos que queremos enviar. Estos pueden ser atrapados por la vista
        titulo: 'Curso de Node'
    })
})

app.get('/generic',(req, res)=>{ 
    // res.sendFile(__dirname +'/public/generic.html'); // sirve el generic.html en la ruta /generic
    res.render('generic',{
        nombre: 'Favio Saico',
        titulo: 'Curso de Node'
    })
})
app.get('/elements',(req, res)=>{ 
    // res.sendFile(__dirname +'/public/elements.html'); // sirve el elements.html en la ruta /elements
    res.render('elements',{
        nombre: 'Favio Saico', 
        titulo: 'Curso de Node'
    })
})

app.get('*', (req, res)=>{ // 
    // res.send('Bienvenido');
    res.sendFile(__dirname +'/public/404.html');// index.ejs
})

// app.use('/users',user); 
app.listen(port, ()=>{
    console.log('Ejemplo conectado en el puerto: ' + port)
})

