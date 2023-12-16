const { log } = require("console");
const conexion = require("../database/db");
const crypto = require("crypto");

function contarSimilitudes(query, params) {
  return new Promise((resolve, reject) => {
    conexion.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0].count);
      }
    });
  });
}

function generarHash(algoritmo, datos) {
  const hash = crypto.createHash(algoritmo);
  hash.update(datos);
  return hash.digest("hex");
}

exports.saveReg = async (req, res) => {
    const Cedula = req.body.cedula;
    const Nombre = req.body.nombre;
    const Apellidos = req.body.apellidos;
    const telefono = req.body.telefono;
    const Correo = req.body.email;
    const Contrasena = req.body.password;
    const FechaNacimiento = req.body.nacimiento;
    const rol = req.body.rol;
    const algoritmo = "sha256";
    const hash = generarHash(algoritmo, Contrasena);
    const fecha_creacion = new Date();

    const check1 = "SELECT COUNT(*) as count FROM usuarios WHERE Cedula = ?";
    const check2 = "SELECT COUNT(*) as count FROM usuarios WHERE Correo = ?";

    try {
        const cedulacheck = await contarSimilitudes(check1, [Cedula]);
        const checkcorreo = await contarSimilitudes(check2, [Correo]);

        if (cedulacheck > 0) {
        console.log("Las cedulas similares fueron: " + cedulacheck);
        } else if (checkcorreo > 0) {
        console.log("Los correos similares fueron: " + checkcorreo);
        } else {
        conexion.query(
            "INSERT INTO usuarios SET ?",
            {
            Cedula: Cedula,
            Nombre: Nombre,
            Apellidos: Apellidos,
            Telefono: telefono,
            Correo: Correo,
            Contrasenna: hash,
            Fecha_nacimiento: FechaNacimiento,
            Rol: rol,
            Fecha_ingreso : fecha_creacion,
            
            },
            (err, results) => {
            if (err) {
                console.log("Error en insert de usuario:", err);
                res.redirect("/AdministradorViewCreateUS");
            } else {
                console.log("Insert en usuario exitoso");
                
                res.redirect("/");
            }
            }
        );
        }
    } catch (err) {
        console.log(err);
        res.redirect("/AdministradorViewCreateUS");
    }
};

exports.loginUser = async(req, res) =>{
  const correo = req.body.email;
  const password = req.body.contrasena;
  const algoritmo = 'sha256';
  const hash = generarHash(algoritmo,password);

  const query = "SELECT * FROM usuarios WHERE Correo  = ? AND Contrasenna = ?";
  conexion.query(query, [correo, hash], (err, result) => {

    if (err) {
      throw err;
    } else {
      try {
        console.log("Usuario encontrado:", result[0]);
        if (hash === result[0].Contrasenna) {
          
            if (result[0].Rol === 1) {

              res.redirect('/homeAdmnin/'+result[0].ID)

            } else if (result[0].Rol === 2) {
                
              res.redirect('/homecliente/'+result[0].ID)

            } else if (result[0].Rol === 3) {
              res.redirect('/homeVendedor/'+result[0].ID)
              
            } else if (result[0].Rol === 4) {
              res.redirect('/bloqueado')
              
            }else {

              console.log("Fallo en comprobacion");

              res.locals.popupMessage =
                "Fallo en comprobacion, pongase en contacto con la administración";
              res.render("Login");
              res.locals.mostrarMensaje = true; // Nueva variable para indicar que se debe mostrar el mensaje
            }
          
        } else {
          console.log("Contraseña Invalida");
          res.locals.popupMessage =
            "Contraseña Inválida o Usuario no encontrado";
          res.locals.mostrarMensaje = true; // Nueva variable para indicar que se debe mostrar el mensaje
          res.render("inicioSesion");
        }
      } catch (err) {
        console.log("Usuario no existe");
        res.locals.popupMessage = "Contraseña Inválida o Usuario no encontrado";
        res.render("inicioSesion");
        res.locals.mostrarMensaje = true; // Nueva variable para indicar que se debe mostrar el mensaje
      }
    }
  });
};

exports.updateUserbyAdmin = async(req,res)=>{
  console.log(req.body);
  const IDADminsitrador =req.body.IDADminsitrador
  const id = req.body.id;
  const Cedula = req.body.cedula;
  const Nombre = req.body.nombre;
  const Apellidos = req.body.apellidos;
  
  const telefono = req.body.telefono;
  const Correo = req.body.correo;
  const Contrasena = req.body.contrasenna;

  const FechaNacimiento = req.body.fecha_nacimiento;
  const rol = req.body.rol;
  const algoritmo = "sha256";
  const hash = generarHash(algoritmo, Contrasena);
  const fecha_creacion = req.body.Fecha_ingreso;
  
  try{
    conexion.query(
      "UPDATE usuarios SET ? WHERE id = ?",
      [{
      ID: id,
      Cedula: Cedula,
      Nombre: Nombre,
      Apellidos: Apellidos,
      Telefono: telefono,
      Correo: Correo,
      Contrasenna: hash,
      Fecha_nacimiento: FechaNacimiento,
      Rol: rol,
      Fecha_ingreso : fecha_creacion,
      
      },id,],
      (err, results) => {
      if (err) {
          console.log("Error en update de usuario:", err);
          res.redirect("/GestionClientes/"+IDADminsitrador);
      } else {
          console.log("Edit en usuario exitoso");          
          res.redirect("/GestionClientes/"+IDADminsitrador);
      }
      });
  }catch (err) {
    console.log(err);
    res.redirect("/GestionClientes/"+IDADminsitrador);
  }
};

exports.updateUserbyUser = async(req,res)=>{
  console.log(req.body);
  const id = req.body.id;
  const Cedula = req.body.cedula;
  const Nombre = req.body.nombre;
  const Apellidos = req.body.apellidos;
  const telefono = req.body.telefono;
  const Correo = req.body.correo;
  const Contrasena = req.body.contrasenna;
  const FechaNacimiento = new Date(req.body.fecha_nacimiento);
  const rol = req.body.rol;
  const algoritmo = "sha256";
  const hash = generarHash(algoritmo, Contrasena);
   const fecha_creacion = new Date();

  try{
    conexion.query(
      "UPDATE usuarios SET ? WHERE id = ?",
      [{
      ID: id,
      Cedula: Cedula,
      Nombre: Nombre,
      Apellidos: Apellidos,
      Telefono: telefono,
      Correo: Correo,
      Contrasenna: hash,
      Fecha_nacimiento: FechaNacimiento,
      Rol: rol,
      Fecha_ingreso : fecha_creacion,
      
      },id,],
      (err, results) => {
      if (err) {
          console.log("Error en update de usuario:", err);
          res.redirect("/homecliente/"+id);
      } else {
          console.log("Edit en usuario exitoso");          
          res.redirect("/homecliente/"+id);
      }
      });
  }catch (err) {
    console.log(err);
    res.redirect("/homecliente/"+id);
  }
};
//crea categorias e administrador

exports.createCategoria = async(req,res)=>{
  const categoriaTO = req.body.txtCategoria;
  const idUsuario = req.body.idUsuario;

  conexion.query("INSERT INTO generos SET ?",
  {
    Genero: categoriaTO
  },(err, results) => {
    if (err) {
        console.log("Error en insert de categoria", err);
        res.redirect("/Categorias/"+idUsuario);
    } else {
        console.log("Insert en Categoria exitoso");
        
        res.redirect("/Categorias/"+idUsuario);
    }
  })
};

exports.formularioBusquedaAvanzada = async(req,res)=>{
  const nombre = req.body.txtNombre;
  const autor = req.body.txtAutor;
  const editorial = req.body.txtEditorial;
  const anno = req.body.txtAnno;
  const genero = req.body.txtGenero;
  const idUsuario = req.body.txtIdUsuario;
  const busquedaAvanzada = 'SELECT * FROM productos WHERE (Nombre LIKE ? and Autor LIKE ? and Editorial LIKE ? and Anno LIKE ? and Genero LIKE ?)';
  console.log("busquedaAvanzada :" +busquedaAvanzada )
  conexion.query(busquedaAvanzada, [`%${nombre}%`, `%${autor}%`, `%${editorial}%`, `%${anno}%`, `%${genero}%`] ,(err, results) => {
    if (err) {
      console.log("Error en Busqueda Avanzada", err);
      res.redirect("/Categorias/"+idUsuario);
  } else {
      console.log("Insert en Categoria exitoso");
      
      res.render("Busqueda.ejs",{results:results, idUsuario});
  }
  })

}