const e = require('express');
const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password : '',
    database : 'mr_books'
})


conexion.connect((error)=>{
    if(error){
        console.error('El error de conexión es: '+error);
        return
    }
    console.log('Conectado a la BD')
});






module.exports = conexion;