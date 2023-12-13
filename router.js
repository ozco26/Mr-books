const express = require('express');
const router = express.Router();
//const conexion = require('./database/db');
const controller = require('./controllers/controller');
const conexion = require('./database/db');

//carga el home
router.get('/',(req,res)=>{
    res.render('home');    
});

//carga vista de inicio de secion
router.get('/inicioSesion',(req,res)=>{
    res.render('inicioSesion');    
});

//carga vista de registro
router.get('/registro',(req,res)=>{
    res.render('registro');    
});

//carga vista de cliente y lleva el numero de usuario además revisa si es administrador y manejo de errores
router.get('/homecliente/:id',(req,res)=>{
    const id = req.params.id;
    const usuario = "SELECT * FROM usuarios WHERE ID=?" ;
    
    conexion.query(usuario, [id], (err, infousuario) => {
        if (err) {
            throw err;
        } else if (!infousuario || infousuario.length === 0) {
            // Si no se encuentra el usuario, redirige a la página bloqueado
            res.redirect('/bloqueado');
        } else if (infousuario[0].Rol !== 2) {
            res.redirect('/bloqueado');
        } else {
            res.render("HomeCliente", {usuario: infousuario[0]});
        }
    }) 
});

//carga vista de adminsitrador y lleva el numero de usuario
router.get('/homeAdmnin/:id',(req,res)=>{
    const id = req.params.id;
    const usuario = "SELECT * FROM usuarios WHERE ID=?" ;
    
    conexion.query(usuario, [id], (err, infousuario) => {
        if (err) {
            throw err;
        } else if (!infousuario || infousuario.length === 0) {
            // Si no se encuentra el usuario, redirige a la página bloqueado
            res.redirect('/bloqueado');
        } else if (infousuario[0].Rol !== 1) {
            res.redirect('/bloqueado');
        }else{
            res.render("home_administrador", {usuario: infousuario[0]});
        }
    }) 
});
 

/*router.get('/homeVend/:id',(req,res)=>{
    res.render('home_vendedor');    
})
*/

//carga la vista de pagina bloqueda
router.get('/bloqueado',(req,res)=>{
    res.render('pagSinAcceso');    
})

//carga lista de usuarios

router.get("/GestionClientes/:id", (req, res) => {
    const id = req.params.id;
    const CargaUsuarios = /*'select * from Usuarios'*/
  
'   SELECT Usuarios.*, roles.Rol FROM Usuarios INNER JOIN roles ON Usuarios.Rol = roles.ID';

    conexion.query(CargaUsuarios, (err, results) => {
        if (err) {
        throw err;
        } else {
        res.render("crudClientes", {
            results: results, id
            
        });
        }
    });
});

//borra usuarios
router.get('/delete/:id/:idUsusario', (req, res) => {
    const id = req.params.id;
    const idUsusario = req.params.idUsusario;
    conexion.query('DELETE FROM usuarios WHERE ID = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect("/GestionClientes/"+idUsusario);
        }
    })
});

//carga pagina de edicion de clientes adminsitrador
router.get('/editar/:id/:idUsuario',(req,res)=>{
    const id = req.params.id;
    const idUsuario = req.params.idUsuario;
    const usuario = "SELECT * FROM usuarios WHERE ID=?" ;
    
    conexion.query(usuario, [id], (err, infousuario) => {
        if (err) {
            throw err;
        } else {
            res.render("editarCuentaAdministrador", {usuario: infousuario[0],idUsuario});
        }
    })
});

//actualiza usuario por administrador

router.get('/editarUsuario/:id',(req,res)=>{
    const id = req.params.id;
    const usuario = "SELECT * FROM usuarios WHERE ID=?" ;
    
    conexion.query(usuario, [id], (err, infousuario) => {
        if (err) {
            throw err;
        } else {
            res.render("editarCuentaCliente", {usuario: infousuario[0]});
        }
    })
});

//Gestión de pedidos
router.get('/Pedido', (req, res)=>{
    
    conexion.query('SELECT * FROM pedidos', (err, results)=>{
        if(err){
            throw err;
        } else{
            res.render('Pedido.ejs', {pedidos:results});
        }


    })
    
})

//Redirige a pantalla de vendedor
router.get('/homeVendedor/:id',(req,res)=>{
    const id = req.params.id;
    const usuario = "SELECT * FROM usuarios WHERE ID=?" ;
    
    conexion.query(usuario, [id], (err, infousuario) => {
        if (err) {
            throw err;
        } else if (!infousuario || infousuario.length === 0) {
            // Si no se encuentra el usuario, redirige a la página bloqueado
            res.redirect('/bloqueado');
        } else if (infousuario[0].Rol !== 3) {
            res.redirect('/bloqueado');
        } else {
            res.render("HomeVendedor.ejs", {usuario: infousuario[0]});
        }
    }) 
});

//  CRUD PRODUCTOS
router.get('/Productos', (req, res)=>{
    conexion.query('SELECT * FROM productos', (err, results)=>{
        if(err){
            throw err;
        } else{
            res.render('CRUDProductos.ejs', {productos:results});
        }
    })   
})

router.get('/Categorias/:idUsuario',(req,res)=>{
    const idUsuario = req.params.idUsuario;
    conexion.query('SELECT * FROM categorias', (err, results)=>{
        if(err){
            throw err;
        } else{
            res.render('gestionCategoria.ejs', {Categorias:results,idUsuario});}
    })  
});

//borra categoria 
router.get('/deleteCategoria/:id/:idUsusario', (req, res) => {
    const id = req.params.id;
    const idUsusario = req.params.idUsusario;
    conexion.query('DELETE FROM Categorias WHERE ID = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect("/Categorias/"+idUsusario);
        }
    })
});

router.post("/saveReg", controller.saveReg);
router.post('/login', controller.loginUser); 
router.post('/updateUserbyAdmin', controller.updateUserbyAdmin);
router.post('/updateUserbyUser', controller.updateUserbyUser);
router.post('/createCategoria',controller.createCategoria);
module.exports = router;