const express = require('express');
const router = express.Router();
//const conexion = require('./database/db');
const controller = require('./controllers/controller');
const conexion = require('./database/db');
const { render } = require('ejs');

//carga el home
router.get('/',(req,res)=>{
    const productosRecientes = "SELECT * FROM productos where Estado = 5 ORDER BY ID_Producto DESC LIMIT 5;" ;
    conexion.query(productosRecientes, (err, infoProducto) => {
        if (err) {
            throw err;
        } else {
            res.render('home',{productos: infoProducto});    
        }
    });
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

            const productosRecientes = "SELECT * FROM productos where Estado = 5 ORDER BY ID_Producto DESC LIMIT 5;" ;
            conexion.query(productosRecientes, (err, infoProducto) => {
                if (err) {
                    throw err;
                } else {res.render('HomeCliente',{productos: infoProducto, usuario: infousuario[0]});
            }
        });
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
 
//carga pagina de vendedor
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

            const productosRecientes = "SELECT * FROM productos where Estado = 5 ORDER BY ID_Producto DESC LIMIT 5;" ;
            conexion.query(productosRecientes, (err, infoProducto) => {
                if (err) {
                    throw err;
                } else {
                    res.render('homeVendedor',{productos: infoProducto, usuario: infousuario[0]});
                }
            });
        }
    }) 
});    

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

//carga pagina de edicion de clientes por adminsitrador
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
router.get('/Pedido/:id', (req, res)=>{
    const id = req.params.id;
    const usuario = "SELECT * FROM usuarios WHERE ID=?" ;
    conexion.query(usuario, [id], (err, infousuario) => {
        if (err) {
            throw err;
        } else {
            conexion.query('SELECT * FROM pedidos', (err, results)=>{
                if(err){
                    throw err;
                } else{
                    res.render('Pedido.ejs', {pedidos:results, usuario: infousuario[0]});
                }     
            })
        }
    })    
})

//  CRUD PRODUCTOS
router.get('/Productos/:id', (req, res) => {
    const id = req.params.id;
    const usuarioQuery = "SELECT * FROM usuarios WHERE ID=?";
    conexion.query(usuarioQuery, [id], (err, infousuario) => {
        if (err) {
            throw err;
        } else if (!infousuario || infousuario.length === 0) {
            // Si no se encuentra el usuario, redirige a la página bloqueado
            res.redirect('/bloqueado');
        } else if (infousuario[0].Rol !== 3) {
            res.redirect('/bloqueado');
        } else {
            // Modificamos la consulta de productos para buscar por el ID
            const productosQuery = 'SELECT * FROM productos WHERE Vendedor=?';
            conexion.query(productosQuery, [id], (errProductos, results) => {
                if (errProductos) {
                    throw errProductos;
                } else {
                    // Consulta para llenar Generos
                    conexion.query('SELECT * FROM generos', (errGeneros, Generos) => {
                        if (errGeneros) {
                            throw errGeneros;
                        } else {
                            res.render('CRUDProductos.ejs', {
                                usuario: infousuario[0],
                                productos: results,
                                Generos: Generos
                            });
                        }
                    });
                }
            });
        }
    });
});


//EDITAR LIBROS

router.get('/EditarP/:id/:idUsusario', (req, res) => {
    const id = req.params.id;
    const idUsusario = req.params.idUsusario;
    conexion.query('SELECT * FROM productos WHERE ID_Producto = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{  
            conexion.query('SELECT * FROM generos', (errGeneros, Generos) => {
                if (errGeneros) {
                    throw errGeneros;
                } else {
                    res.render("EditarProducto.ejs",{
                        producto:results[0],idUsusario, Generos: Generos
                }         
            )};
            });
        }
    })
});

//BORRAR LIBROS
router.get('/deleteP/:id/:idUsusario', (req, res) => {
    const id = req.params.id;
    const idUsusario = req.params.idUsusario;
    conexion.query('DELETE FROM productos WHERE ID_Producto = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect("/Productos/"+idUsusario);
        }
    })
});

//carga pagina de Crear generos
router.get('/Categorias/:idUsuario',(req,res)=>{
    const idUsuario = req.params.idUsuario;
    conexion.query('SELECT * FROM generos', (err, results)=>{
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
    conexion.query('DELETE FROM generos WHERE ID = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect("/Categorias/"+idUsusario);
        }
    })
});

//carga la pagina de cada libro

router.get('/libro/:idlibro/:idUsuario?', (req, res) => {
    const idlibro = req.params.idlibro; 
    const idUsuario = req.params.idUsuario;
    conexion.query('SELECT productos.*, generos.Genero FROM productos INNER JOIN generos ON productos.Genero = generos.ID_Genero WHERE ID_Producto = ?'

    , [idlibro], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('libro.ejs', { productos: results[0], idUsuario });
        }
    });
});


//Gestion de libros
router.get('/GestionLibros/:idUsuario',(req,res)=>{
    const idUsuario = req.params.idUsuario;
    conexion.query(
        'select * from productos',
        (err,results) =>{
            if (err) {
                console.log;
            }else{
                res.render('gestionLibros.ejs',{productos:results, idUsuario})
            }
        }
    )
});

//Eliminar Pedido
router.get('/deletePedidos/:id/:idUsusario', (req, res) => {
    const id = req.params.id;
    const idUsusario = req.params.idUsusario;
    conexion.query('DELETE FROM pedidos WHERE ID_Pedido = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect("/Pedido/"+idUsusario);
        }
    })
});

//Actualizar Pedido
router.get('/actualizarPedido/:id/:idUsuario/:nuevoEstado', (req, res) => {
    const idPedido = req.params.id;
    const nuevoEstado = req.params.nuevoEstado;
    const idUsuario = req.params.idUsuario;
    conexion.query(
      'UPDATE pedidos SET Estado = ? WHERE ID_Pedido = ?',
      [nuevoEstado, idPedido],
      (error, results) => {
        if (error) {
            console.log(error);
        } else {
          res.redirect('/Pedido/' +idUsuario);
        }
      }
    );
  });

//borra productos por admin
router.get('/deleteProducto/:id/:idUsusario', (req, res) => {
    const id = req.params.id;
    const idUsusario = req.params.idUsusario;
    conexion.query('DELETE FROM productos WHERE ID_Producto = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect("/GestionLibros/"+idUsusario);
        }
    })
});

//Carga pagina de Aprobación de libros
router.get('/Aprobacion/:id', (req, res)=>{
    const id = req.params.id;
    const usuario = "SELECT * FROM usuarios WHERE ID=?" ;
    conexion.query(usuario, [id], (err, infousuario) => {
        if (err) {
            throw err;
        } else {
            conexion.query('SELECT * FROM productos WHERE Estado= 4', (err, results)=>{
                if(err){
                    throw err;
                } else{
                    res.render('AprobacionLibros.ejs', {productos:results, usuario: infousuario[0]});
                }     
            })
        }
    })    
})


//APROBAR LIBRO PARA VENTA
router.get('/AprobarLibrosAdmin/:id/:idUsuario', (req, res) => {
    const idPedido = req.params.id;
    const nuevoEstado = 5;
    const idUsuario = req.params.idUsuario;
    conexion.query(
      'UPDATE productos SET Estado = ? WHERE ID_Producto = ?',
      [nuevoEstado, idPedido],
      (error, results) => {
        if (error) {
            console.log(error);
        } else {
          res.redirect('/Aprobacion/' +idUsuario);
        }
      }
    );
  });

//APROBAR LIBRO
router.get('/RechazarLibroAdmin/:id/:idUsuario', (req, res) => {
    const idPedido = req.params.id;
    const nuevoEstado = 6;
    const idUsuario = req.params.idUsuario;
    conexion.query(
      'UPDATE productos SET Estado = ? WHERE ID_Producto = ?',
      [nuevoEstado, idPedido],
      (error, results) => {
        if (error) {
            console.log(error);
        } else {
          res.redirect('/Aprobacion/' +idUsuario);
        }
      }
    );
  });
// carga pagina de carrito
router.get("/carrito/:idUsuario", (req, res) => {
  const idUsuario = req.params.idUsuario;
  conexion.query(
    'select * from carrito where Usuario = ? and Activo = "Si"',
    [idUsuario],
    (error, carrito) => {
      if (error) {
        console.log(error);
      } else {
        const consulta = `SELECT ic.ID_Producto, p.Nombre, p.Autor, p.Editorial, p.Anno, p.Idioma, p.Genero, p.Precio
            FROM items_carrito ic
            JOIN productos p ON ic.ID_Producto = p.ID_Producto
            WHERE ic.ID_Carrito = ?`;

        conexion.query(consulta,
          [carrito[0].ID_Carrito],
          (error, items) => {
            if (error) {
              console.log(error);
            } else {

                let subtotal = 0;
                items.forEach((item) => {
                    subtotal += item.Precio;
                });
                let IVA = subtotal*.13;
                let total =IVA + subtotal;

              res.render("Carrito.ejs", { idUsuario, items:items, subtotal, IVA, total, carrito:carrito[0] });
            }
          }
        );
      }
    }
  );
});

// eliminar producto del carrito y devolver estado de disponible
router.get("/deleteItemCarrito/:idProducto/:idUsuario", (req, res) => {
    const idProducto = req.params.idProducto;
    const idUsuario = req.params.idUsuario;
    const actualizarEstado = "UPDATE productos SET Estado = 5 WHERE ID_Producto = ?";
    conexion.query(actualizarEstado, [idProducto], (err, result) => {
        if (err) {
          console.error("Error al actualizar el estado del producto:", err);
        }else{
            console.log("Exito en actualizar el estado del producto");
            
            const eliminarItemCarrito = "DELETE FROM items_carrito WHERE ID_Producto = ?";
            conexion.query(eliminarItemCarrito, [idProducto], (err, result) => {
                if (err) {
                  console.error("Error al eliminar el registro de item_carrito:", err);
                } else{
                    console.log("Exito en eliminar el regitro de Item_carrito");
                    res.redirect("/carrito/"+idUsuario)
                }
            });
        }
    });   
});

//metodo añadir al carrito
router.get("/addCarrito/:idUsuario/:ID_Producto", (req, res) => {
  const idUsuario = req.params.idUsuario;
  const ID_Producto = parseInt(req.params.ID_Producto);
  conexion.query(
    'select * from carrito where Usuario = ? and Activo = "Si"',
    [idUsuario],
    (error, carrito) => {
      if (error) {
        console.log(error);
      } else {
        const setItem = `insert into items_carrito set ?`;
        conexion.query(
          setItem,
          [
            {
              ID_Producto: ID_Producto,
              ID_Carrito: carrito[0].ID_Carrito,
              Descuento: 0,
            },
          ],
          (error, result) => {
            if (error) {
              console.log(error);
            } else {
                console.log("inser  items_carrito exitosa");
              const updItem = `UPDATE productos SET Estado = '7' WHERE ID_Producto = ?`;
              conexion.query(
                updItem,
                [
                 ID_Producto
                ],
                (error, result) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("Update producto exitosa");
                    res.redirect("/carrito/" + idUsuario);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.get("/Novedades/:idUsuario?",(req,res)=>{

    const idUsuario = req.body.txtIdUsuario1;
    const busqueda = 'SELECT * FROM productos WHERE Estado = 5 ORDER BY ID_Producto DESC ';
    conexion.query(busqueda ,(err, results) => {
      if (err) {
        console.log("Error en Busqueda", err);
    } else {       
        res.render("Busqueda.ejs",{results:results, idUsuario});
    }
    })
})



router.post("/updateLibros", controller.updateLibros);
router.post("/saveProduct", controller.saveProduct);
router.post("/saveReg", controller.saveReg);
router.post('/login', controller.loginUser); 
router.post('/updateUserbyAdmin', controller.updateUserbyAdmin);
router.post('/updateUserbyUser', controller.updateUserbyUser);
router.post('/createCategoria',controller.createCategoria);
router.post('/formularioBusquedaAvanzada',controller.formularioBusquedaAvanzada)
router.post('/formularioBusqueda',controller.formularioBusqueda)
module.exports = router;