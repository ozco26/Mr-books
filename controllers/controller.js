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
            Fecha_ingreso : Date(),
            
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