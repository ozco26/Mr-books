const express = require('express');
const router = express.Router();
//const conexion = require('./database/db');
const controller = require('./controllers/controller');

const conexion = require('./database/db');

router.get('/',(req,res)=>{
    res.render('home');    
});

router.get('/inicioSesion',(req,res)=>{
    res.render('inicioSesion');    
});

router.get('/registro',(req,res)=>{
    res.render('registro');    
});

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
router.get('/bloqueado',(req,res)=>{
    res.render('pagSinAcceso');    
})

router.get("/GestionClientes", (req, res) => {
  const CargaUsuarios = /*'select * from Usuarios'*/
  
'   SELECT Usuarios.*, roles.Rol FROM Usuarios INNER JOIN roles ON Usuarios.Rol = roles.ID';

  conexion.query(CargaUsuarios, (err, results) => {
    if (err) {
      throw err;
    } else {
      res.render("crudClientes", {
        results: results,
        
      });
    }
  });
});

router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    conexion.query('DELETE FROM usuarios WHERE ID = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect("/GestionClientes");
        }
    })
});



router.post("/saveReg", controller.saveReg);
router.post('/login', controller.loginUser); 
module.exports = router;