const express = require('express');
const router = express.Router();
//const conexion = require('./database/db');
const controller = require('./controllers/controller');


const conexion = require('./database/db');

router.get('/',(req,res)=>{
    res.render('home');    
})

router.get('/inicioSesion',(req,res)=>{
    res.render('inicioSesion');    
})

router.get('/registro',(req,res)=>{
    res.render('registro');    
})

router.get('/homecliente',(req,res)=>{
    res.render('HomeCliente');    
})

router.post("/saveReg", controller.saveReg);
router.post('/login', controller.loginUser); 
module.exports = router;