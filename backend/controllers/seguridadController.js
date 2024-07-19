const { enviarCorreo } = require("../helpers/CorreoHelper"); // Importa el helper
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");
const Rol = require("../models/Rol");
const Grupo = require("../models/Grupo");
const GruposEstudiantes = require("../models/GruposEstudiantes");
const Sequelize = require("sequelize");
const UsuarioRoles = require("../models/UsuarioRol");
const crypto = require("crypto");

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: {
        model: UsuarioRoles,
        attributes: ["RolId"],
        include: {
          model: Rol,
          attributes: ["NombreRol"], // Incluir solo NombreRol de la tabla Rol
        },
      },
    });

    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsuarioRol = async (req, res) => {
  try {
    const roles = await UsuarioRoles.findAll({
      include: [
        {
          model: Usuario, // Nombre del modelo relacionado
        },
      ],
    });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllAcademicos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['Identificacion', 'Nombre', 'Apellido1', 'Apellido2','Sede'],
      include: [
        {
          model: UsuarioRoles,
          where: { RolId: 2 },
          attributes: [], // No incluir ningún atributo de UsuarioRoles
        },
      ],
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getUsuarioPorNombre = async (req, res) => {
  try {
    const { Apellido1, Apellido2, Nombre } = req.query;

    // Buscar el usuario por su nombre y apellidos
    const usuario = await Usuario.findOne({
      where: {
        Apellido1: Apellido1,
        Apellido2: Apellido2,
        Nombre: Nombre,
      },
    });

    if (!usuario) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado por nombre" });
    }

    // Retornar solo el campo de Identificación
    res.status(200).json({ Identificacion: usuario.Identificacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsuarioPorIdentificacion = async (req, res) => {
  try {
    const { Identificacion } = req.params;

    // Buscar el usuario por su número de identificación y traer también los roles asociados
    const usuario = await Usuario.findOne({
      where: {
        Identificacion: Identificacion,
      },
      include: {
        model: UsuarioRoles,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNombrePorIdentificacion = async (req, res) => {
  try {
    const { Identificacion } = req.params;

    // Buscar el usuario por su número de identificación y traer también los roles asociados
    const usuario = await Usuario.findOne({
      where: {
        Identificacion: Identificacion,
      },
      attributes: ['Nombre', 'Apellido1', 'Apellido2'],
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRolesPorIdentificacion = async (req, res) => {
  try {
    const { Identificacion } = req.params;

    // Buscar el usuario por su número de identificación y traer solo el atributo RolID y el NombreRol relacionado
    const roles = await UsuarioRoles.findAll({
      where: {
        Identificacion: Identificacion,
      },
      attributes: ["RolId"], // Seleccionar solo la columna RolID de UsuarioRoles
      include: [
        {
          model: Rol,
          attributes: ["NombreRol"], // Seleccionar solo la columna NombreRol de la tabla Rol
        },
      ],
    });

    if (roles.length === 0) {
      return res
        .status(404)
        .json({ error: "Roles no encontrados para el usuario" });
    }

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsuarioPorCredenciales = async (req, res) => {
  try {
    const { CorreoElectronico, Contrasenna } = req.body; // Suponiendo que estás enviando los parámetros en el cuerpo de la solicitud

    // Buscar un usuario que coincida con el correo electrónico proporcionado
    const usuario = await Usuario.findOne({
      where: {
        CorreoElectronico: CorreoElectronico,
      },
      include: {
        model: UsuarioRoles,
        attributes: ["RolId"],
        include: {
          model: Rol,
          attributes: ["NombreRol"], // Incluir solo NombreRol de la tabla Rol
        },
      },
    });

    if (usuario) {
      // Verificar si el usuario está inactivo
      if (!usuario.Estado) {
        // Si el usuario está inactivo, devolver un mensaje de error
        return res.status(403).json({ error: "El usuario está inactivo" });
      }

      // Comparar la contraseña proporcionada con la contraseña encriptada en la base de datos
      const contrasennaValida = await bcrypt.compare(
        Contrasenna,
        usuario.Contrasenna
      );
      if (contrasennaValida) {
        // Extraer los roles del usuario
        const roles = usuario.Usuarios_Roles.map(usuarioRol => usuarioRol.Rol.NombreRol);

        // Devolver solo los campos requeridos
        const usuarioResponse = {
          Identificacion: usuario.Identificacion,
          Nombre: usuario.Nombre,
          RolUsuario: roles, // Aquí almacenamos todos los NombreRol
          CorreoElectronico: usuario.CorreoElectronico,
          Genero: usuario.Genero,
          Sede: usuario.Sede
        };
        res.json(usuarioResponse);
      } else {
        // Si la contraseña no es válida, devolver un mensaje de error
        res.status(401).json({ error: "Usuario o contraseña inválida" });
      }
    } else {
      // Si no se encuentra ningún usuario que coincida, devolver un mensaje de error
      res.status(401).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};

const actualizarContrasenna = async (req, res) => {
  try {
    const {
      CorreoElectronico,
      ContrasennaAntigua,
      ContrasennaNueva,
      ConfirmacionContrasenna,
    } = req.body;

    // Verificar que las nuevas contraseñas coincidan
    if (ContrasennaNueva !== ConfirmacionContrasenna) {
      return res
        .status(400)
        .json({
          error: "La nueva contraseña y la confirmación deben ser iguales",
        });
    }

    // Buscar un usuario que coincida con el correo electrónico proporcionado
    const usuario = await Usuario.findOne({
      where: {
        CorreoElectronico: CorreoElectronico,
      },
    });

    // Si se encuentra un usuario, verificar la contraseña antigua y actualizar la contraseña
    if (usuario) {
      const contrasennaValida = await bcrypt.compare(
        ContrasennaAntigua,
        usuario.Contrasenna
      );
      if (contrasennaValida) {
        const hashedPassword = await bcrypt.hash(ContrasennaNueva, 10); // Encriptar la nueva contraseña
        usuario.Contrasenna = hashedPassword;
        await usuario.save(); // Guardar los cambios en la base de datos
        return res.json({ message: "Contraseña actualizada correctamente" });
      } else {
        return res
          .status(401)
          .json({ error: "La contraseña antigua no es válida" });
      }
    } else {
      // Si no se encuentra ningún usuario que coincida, devolver un mensaje de error
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};

const generarContrasennaAleatoria = () => {
  // Definir los caracteres permitidos en la contraseña
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let contrasenna = "";
  // Generar una contraseña aleatoria de 8 caracteres
  for (let i = 0; i < 8; i++) {
    const randomIndex = crypto.randomInt(0, caracteres.length);
    contrasenna += caracteres[randomIndex];
  }
  return contrasenna;
};

const generarMensajeHtml = (nuevaContrasenna) => {
  const year = new Date().getFullYear();
  const textColor = "#002c6b"; // Color de texto para el contenido principal
  return `
    <div style="font-family: 'Century Gothic', sans-serif; color: ${textColor};">
      <header style="background-color: #002c6b; color: white; text-align: center; padding: 10px;">
        <h1 style="margin: 0;">Contraseña temporal Bitácora TCU UTN</h1>
      </header>
      <div style="padding: 20px;">
        <p>Estimado(a): </p>
        <p>Por favor no comparta su clave temporal con nadie más.</p> 
        <p>La clave temporal es: <strong>${nuevaContrasenna}</strong></p>
        <p>Por favor, cámbiala después de iniciar sesión.</p>
      </div>
      <footer style="background-color: #002c6b; color: white; text-align: center; padding: 10px; margin-top: 20px;">
        <p>Bitácora TCU - Derechos Reservados © ${year}</p>
      </footer>
    </div>
  `;
};

const olvidoContrasenna = async (req, res) => {
  try {
    const { CorreoElectronico } = req.body;

    // Buscar un usuario que coincida con el correo electrónico proporcionado
    const usuario = await Usuario.findOne({
      where: {
        CorreoElectronico: CorreoElectronico,
        Estado:1,
      },
    });

    // Si se encuentra un usuario, generar y actualizar la contraseña
    if (usuario) {
      const nuevaContrasenna = generarContrasennaAleatoria();
      const salt = await bcrypt.genSalt(10); // Generar una sal para la encriptación
      const hashedPassword = await bcrypt.hash(nuevaContrasenna, salt); // Encriptar la nueva contraseña
      usuario.Contrasenna = hashedPassword;
      await usuario.save(); // Guardar los cambios en la base de datos

      // Enviar el correo electrónico con la nueva contraseña
      const asunto = "Recuperación de contraseña";
      const mensajeHtml = generarMensajeHtml(nuevaContrasenna);
      await enviarCorreo(CorreoElectronico, asunto, mensajeHtml);

      res.json({
        message: "Contraseña actualizada correctamente",
      });
    } else {
      // Si no se encuentra ningún usuario que coincida, devolver un mensaje de error
      res.status(404).json({ error: "Usuario no encontrado o desactivado" });
    }
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};

// Función para crear o modificar un usuario
const crearOActualizarUsuario = async (req, res) => {
  try {
    const {
      Identificacion,
      Nombre,
      Apellido1,
      Apellido2,
      Genero = "Indefinido",
      CorreoElectronico,
      Contrasenna,
      Estado,
      CarreraEstudiante = "-",
      Sede,
      Usuarios_Roles,
      GrupoId, // nuevo parámetro
    } = req.body;


    // Asignar valores por defecto si son cadenas vacías
    const generoFinal = Genero === '' ? 'Indefinido' : Genero;
    const carreraEstudianteFinal = CarreraEstudiante === '' ? '-' : CarreraEstudiante;

    // Verificar si el correo electrónico ya está asignado a otro usuario
    const correoExistente = await Usuario.findOne({
      where: {
        CorreoElectronico: CorreoElectronico,
      },
    });

    if (correoExistente && correoExistente.Identificacion !== Identificacion) {
      return res.status(400).json({
        error: "El correo electrónico ya está asignado a otro usuario",
      });
    }

    // Verificar si ya existe un usuario con la identificación proporcionada
    let usuarioExistente = await Usuario.findOne({
      where: {
        Identificacion: Identificacion,
      },
    });

    // Encriptar la contraseña si se proporciona
    const hashedPassword = Contrasenna ? await bcrypt.hash(Contrasenna, 10) : null;

    if (usuarioExistente) {
      // Modificar el usuario existente
      const updateData = {
        Nombre: Nombre,
        Apellido1: Apellido1,
        Apellido2: Apellido2,
        Genero: generoFinal,
        CorreoElectronico: CorreoElectronico,
        Estado: Estado,
        CarreraEstudiante: carreraEstudianteFinal,
        Sede: Sede,
      };

      if (hashedPassword) {
        updateData.Contrasenna = hashedPassword;
      }

      usuarioExistente = await usuarioExistente.update(updateData);

      // Actualizar roles de usuario
      await actualizarRolesUsuario(Identificacion, Usuarios_Roles);

      // Verificar y actualizar el registro en GruposEstudiantes si GrupoId está presente
      if (GrupoId) {
        let grupoEstudianteExistente = await GruposEstudiantes.findOne({
          where: {
            Identificacion: Identificacion,
            GrupoId: GrupoId,
          },
        });

        if (!grupoEstudianteExistente) {
          await GruposEstudiantes.create({
            Identificacion: Identificacion,
            GrupoId: GrupoId,
            Estado: "En Curso",
          });
        }
      }

      return res.status(200).json(usuarioExistente);
    }

    // Crear el nuevo usuario
    const nuevaContrasenna = Contrasenna || generarContrasennaAleatoria();
    const nuevaContrasennaHashed = await bcrypt.hash(nuevaContrasenna, 10);

    const nuevoUsuario = await Usuario.create({
      Identificacion: Identificacion,
      Nombre: Nombre,
      Apellido1: Apellido1,
      Apellido2: Apellido2,
      Genero: generoFinal,
      CorreoElectronico: CorreoElectronico,
      Contrasenna: nuevaContrasennaHashed, // Se almacena la contraseña encriptada
      Estado: Estado,
      CarreraEstudiante: carreraEstudianteFinal,
      Sede: Sede,
    });

    // Agregar roles de usuario
    await agregarRolesUsuario(Identificacion, Usuarios_Roles);

    // Verificar y crear el registro en GruposEstudiantes si GrupoId está presente
    if (GrupoId) {
      let grupoEstudianteExistente = await GruposEstudiantes.findOne({
        where: {
          Identificacion: Identificacion,
          GrupoId: GrupoId,
        },
      });

      if (!grupoEstudianteExistente) {
        await GruposEstudiantes.create({
          Identificacion: Identificacion,
          GrupoId: GrupoId,
          Estado: "En Curso",
        });
      }
    }

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





const agregarRolesUsuario = async (Identificacion, Usuarios_Roles) => {
  for (const rol of Usuarios_Roles) {
    await UsuarioRoles.create({
      Identificacion: Identificacion,
      RolId: rol.RolId,
      LastUpdate: rol.LastUpdate,
      LastUser: rol.LastUser,
      UniversalUniqueIdentifier: rol.UniversalUniqueIdentifier,
    });
  }
};

const actualizarRolesUsuario = async (Identificacion, Usuarios_Roles) => {
  const rolesExistentes = await UsuarioRoles.findAll({
    where: { Identificacion: Identificacion },
  });

  // Eliminar roles no presentes en Usuarios_Roles
  for (const rolExistente of rolesExistentes) {
    if (!Usuarios_Roles.some(rol => rol.RolId === rolExistente.RolId)) {
      await rolExistente.destroy();
    }
  }

  // Agregar o actualizar roles presentes en Usuarios_Roles
  for (const rol of Usuarios_Roles) {
    const rolExistente = rolesExistentes.find(re => re.RolId === rol.RolId);
    if (rolExistente) {
      await rolExistente.update({
        LastUpdate: rol.LastUpdate,
        LastUser: rol.LastUser,
        UniversalUniqueIdentifier: rol.UniversalUniqueIdentifier,
      });
    } else {
      await UsuarioRoles.create({
        Identificacion: Identificacion,
        RolId: rol.RolId,
        LastUpdate: rol.LastUpdate,
        LastUser: rol.LastUser,
        UniversalUniqueIdentifier: rol.UniversalUniqueIdentifier,
      });
    }
  }
};

// Función para crear o modificar un usuario
const cargarUsuario = async (req, res) => {
  const users = req.body;
  try {
    for (let userData of users) {
      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(userData.Contrasenna, 10);
      userData.Contrasenna = hashedPassword;

      // Verificar si el usuario ya existe
      let usuarioExistente = await Usuario.findOne({
        where: {
          Identificacion: userData.Identificacion,
        },
      });

      if (usuarioExistente) {
        // Actualizar el usuario existente
        await usuarioExistente.update({
          Nombre: userData.Nombre,
          Apellido1: userData.Apellido1,
          Apellido2: userData.Apellido2,
          CorreoElectronico: userData.CorreoElectronico,
          Estado: userData.Estado,
          TipoIdentificacion: userData.TipoIdentificacion,
        });
      } else {
        // Crear un nuevo usuario
        usuarioExistente = await Usuario.create({
          Identificacion: userData.Identificacion,
          Nombre: userData.Nombre,
          Apellido1: userData.Apellido1,
          Apellido2: userData.Apellido2,
          CorreoElectronico: userData.CorreoElectronico,
          Contrasenna: userData.Contrasenna,
          Estado: userData.Estado,
          TipoIdentificacion: userData.TipoIdentificacion,
        });
      }

      // Buscar el RolId correspondiente al RolUsuario
      const rol = await Rol.findOne({
        where: {
          NombreRol: userData.RolUsuario,
        },
      });

      if (!rol) {
        return res
          .status(400)
          .send(`Rol no encontrado para RolUsuario: ${userData.RolUsuario}`);
      }

      const RolId = rol.RolId;

      // Verificar si la combinación de Identificacion y RolId ya existe en UsuarioRoles
      const usuarioRolExistente = await UsuarioRoles.findOne({
        where: {
          Identificacion: userData.Identificacion,
          RolId: RolId,
        },
      });

      if (!usuarioRolExistente) {
        // Crear un nuevo registro en UsuarioRoles
        await UsuarioRoles.create({
          Identificacion: userData.Identificacion,
          RolId: RolId,
        });
      }

      if (userData.RolUsuario === "Estudiante") {
        // Buscar el grupoId en la tabla Grupo
        let grupo = await Grupo.findOne({
          where: {
            CodigoMateria: userData.CodigoMateria,
            Cuatrimestre: userData.Cuatrimestre,
            NumeroGrupo: userData.Grupo,
            Anno: userData.Anno,
            Sede: userData.Sede
          },
        });

        if (!grupo) {
          // Si el grupo no se encuentra, retornar un mensaje de error
          return res
            .status(400)
            .send(
              `Grupo no encontrado para CodigoMateria: ${userData.CodigoMateria}, Cuatrimestre: ${userData.Cuatrimestre}, Anno: ${userData.Anno}`
            );
        }

        const grupoId = grupo.GrupoId; // Asumiendo que el campo ID es "GrupoId"

        // Verificar si el registro en GruposEstudiantes ya existe
        let grupoEstudianteExistente = await GruposEstudiantes.findOne({
          where: {
            Identificacion: userData.Identificacion,
            GrupoId: grupoId,
          },
        });

        if (!grupoEstudianteExistente) {
          // Crear un nuevo registro en GruposEstudiantes
          await GruposEstudiantes.create({
            Identificacion: userData.Identificacion,
            GrupoId: grupoId,
            Estado: "En Curso",
          });
        }
      }
    }

    res.status(200).send("Usuarios cargados/actualizados exitosamente");
  } catch (error) {
    res.status(500).send("Error al cargar/actualizar los usuarios", error);
  }
};

const cargaCarreras = async (req, res) => {
  const users = req.body;

  try {
    // Buscar todos los UsuarioRoles con RolId = 3 e incluir los Usuarios con CarreraEstudiante igual a "-"
    const usuariosRoles = await UsuarioRoles.findAll({
      where: {
        RolId: 3,
      },
      include: [
        {
          model: Usuario,
          where: {
            CarreraEstudiante: "-",
          },
        },
      ],
    });

    for (let usuarioRol of usuariosRoles) {
      const identificacion = String(usuarioRol.Usuario.Identificacion);

      // Buscar en const users si existe una línea que coincida con la Identificacion
      const userData = users.find((user) => String(user.Identificacion) === identificacion);

      if (userData) {
        // Actualizar el campo CarreraEstudiante en la base de datos
        await Usuario.update(
          {
            CarreraEstudiante: userData.CarreraEstudiante,
          },
          {
            where: {
              Identificacion: identificacion,
            },
          }
        );
      }
    }

    res.status(200).send("Se han añadido las carreras de los Usuarios encontrados");
  } catch (error) {
    res.status(500).send("Error al cargar/actualizar los usuarios");
  }
};




const EstadoUsuario = async (req, res) => {
  try {
    const { Identificacion } = req.body;

    // Buscar el usuario por su número de identificación
    const usuario = await Usuario.findOne({
      where: {
        Identificacion: Identificacion,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Cambiar el estado del usuario
    usuario.Estado = !usuario.Estado;

    // Guardar los cambios en la base de datos
    await usuario.save();

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarGenero = async (req, res) => {
  try {
    const { Identificacion, Genero } = req.body;

    // Buscar el usuario por su número de identificación
    const usuario = await Usuario.findOne({
      where: {
        Identificacion: Identificacion,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualizar el género del usuario
    usuario.Genero = Genero;

    // Guardar los cambios en la base de datos
    await usuario.save();

    res.status(200).json({ message: "Género actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioPorNombre,
  getUsuarioPorCredenciales,
  actualizarContrasenna,
  olvidoContrasenna,
  getRolesPorIdentificacion,
  crearOActualizarUsuario,
  EstadoUsuario,
  getAllUsuarioRol,
  getAllAcademicos,
  getUsuarioPorIdentificacion,
  actualizarGenero,
  cargarUsuario,
  cargaCarreras,
  getNombrePorIdentificacion
};
