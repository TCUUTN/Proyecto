const pool = require("../config/db");
const { enviarCorreo } = require('../helpers/CorreoHelper'); // Importa el helper
const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");
const crypto = require("crypto");

const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUsuarioPorIdentificacion = async (req, res) => {
  try {
    const { Identificacion } = req.params;

    // Buscar el usuario por su número de identificación
    const usuario = await Usuario.findOne({
      where: {
        Identificacion: Identificacion,
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

const getUsuarioPorCredenciales = async (req, res) => {
  try {
    const { CorreoElectronico, Contrasenna } = req.body; // Suponiendo que estás enviando los parámetros en el cuerpo de la solicitud

    // Buscar un usuario que coincida con el correo electrónico proporcionado
    const usuario = await Usuario.findOne({
      where: {
        CorreoElectronico: CorreoElectronico,
      },
    });

    if (usuario) {
      // Verificar si el usuario está inactivo
      if (!usuario.Estado) {
        // Si el usuario está inactivo, devolver un mensaje de error
        return res.status(403).json({ error: "El usuario está inactivo" });
      }

      // Comparar la contraseña proporcionada con la contraseña encriptada en la base de datos
      const contrasennaValida = await bcrypt.compare(Contrasenna, usuario.Contrasenna);
      if (contrasennaValida) {
        // Devolver solo Nombre, RolUsuario y CorreoElectronico
        const usuarioResponse = {
          Nombre: usuario.Nombre,
          RolUsuario: usuario.RolUsuario,
          CorreoElectronico: usuario.CorreoElectronico,
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
    const { CorreoElectronico, ContrasennaAntigua, ContrasennaNueva, ConfirmacionContrasenna } = req.body;

    // Verificar que las nuevas contraseñas coincidan
    if (ContrasennaNueva !== ConfirmacionContrasenna) {
      return res.status(400).json({ error: "La nueva contraseña y la confirmación deben ser iguales" });
    }

    // Buscar un usuario que coincida con el correo electrónico proporcionado
    const usuario = await Usuario.findOne({
      where: {
        CorreoElectronico: CorreoElectronico,
      },
    });

    // Si se encuentra un usuario, verificar la contraseña antigua y actualizar la contraseña
    if (usuario) {
      const contrasennaValida = await bcrypt.compare(ContrasennaAntigua, usuario.Contrasenna);
      if (contrasennaValida) {
        const hashedPassword = await bcrypt.hash(ContrasennaNueva, 10); // Encriptar la nueva contraseña
        usuario.Contrasenna = hashedPassword;
        await usuario.save(); // Guardar los cambios en la base de datos
        return res.json({ message: "Contraseña actualizada correctamente" });
      } else {
        return res.status(401).json({ error: "La contraseña antigua no es válida" });
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
      const asunto = 'Recuperación de contraseña';
      const mensajeHtml = generarMensajeHtml(nuevaContrasenna);
      await enviarCorreo(CorreoElectronico, asunto, mensajeHtml);

      res.json({
        message: "Contraseña actualizada correctamente",
      });
    } else {
      // Si no se encuentra ningún usuario que coincida, devolver un mensaje de error
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    // Manejo de errores
    res.status(500).json({ error: err.message });
  }
};

// Función para crear o modificar un usuario
const crearOActualizarUsuario = async (req, res) => {
  try {
    const { Identificacion, Nombre, Apellido1, Apellido2, Genero, CorreoElectronico, RolUsuario, Contrasenna, Estado, TipoIdentificacion } = req.body;

    // Verificar si el correo electrónico ya está asignado a otro usuario
    const correoExistente = await Usuario.findOne({
      where: {
        CorreoElectronico: CorreoElectronico,
      },
    });

    if (correoExistente && correoExistente.Identificacion !== Identificacion) {
      return res.status(400).json({ error: "El correo electrónico ya está asignado a otro usuario" });
    }

    // Verificar si ya existe un usuario con la identificación proporcionada
    let usuarioExistente = await Usuario.findOne({
      where: {
        Identificacion: Identificacion,
      },
    });

    if (usuarioExistente) {
      // Modificar el usuario existente

        // Encriptar la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(Contrasenna, 10);
      usuarioExistente = await usuarioExistente.update({
        Nombre: Nombre,
        Apellido1: Apellido1,
        Apellido2: Apellido2,
        Genero: Genero,
        CorreoElectronico: CorreoElectronico,
        RolUsuario: RolUsuario,
        Contrasenna: hashedPassword,
        Estado: Estado,
        TipoIdentificacion: TipoIdentificacion,
      });

      return res.status(200).json(usuarioExistente);
    }

    // Encriptar la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(Contrasenna, 10);

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      Identificacion: Identificacion,
      Nombre: Nombre,
      Apellido1: Apellido1,
      Apellido2: Apellido2,
      Genero: Genero,
      CorreoElectronico: CorreoElectronico,
      RolUsuario: RolUsuario,
      Contrasenna: hashedPassword, // Se almacena la contraseña encriptada
      Estado: Estado,
      TipoIdentificacion: TipoIdentificacion,
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para crear o modificar un usuario
const cargarUsuario = async (req, res) => {
  const users = req.body;

  try {
    for (let userData of users) {
      const hashedPassword = await bcrypt.hash(userData.Contrasenna, 10);
      userData.Contrasenna = hashedPassword;

      // Check if a user with the provided ID already exists
      let usuarioExistente = await Usuario.findOne({
        where: {
          Identificacion: userData.Identificacion,
        },
      });

      if (usuarioExistente) {
        // Update the existing user
        await usuarioExistente.update({
          Nombre: userData.Nombre,
          Apellido1: userData.Apellido1,
          Apellido2: userData.Apellido2,
          Genero: userData.Genero,
          CorreoElectronico: userData.CorreoElectronico,
          RolUsuario: userData.RolUsuario,
          Contrasenna: userData.Contrasenna,
          Estado: userData.Estado,
          TipoIdentificacion: userData.TipoIdentificacion,
        });
      } else {
        // Create a new user
        await Usuario.create({
          Identificacion: userData.Identificacion,
          Nombre: userData.Nombre,
          Apellido1: userData.Apellido1,
          Apellido2: userData.Apellido2,
          Genero: userData.Genero,
          CorreoElectronico: userData.CorreoElectronico,
          RolUsuario: userData.RolUsuario,
          Contrasenna: userData.Contrasenna,
          Estado: userData.Estado,
          TipoIdentificacion: userData.TipoIdentificacion,
        });
      }
    }

    res.status(200).send('Usuarios cargados/actualizados exitosamente');
  } catch (error) {
    console.error('Error al cargar/actualizar los usuarios:', error);
    res.status(500).send('Error al cargar/actualizar los usuarios');
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

module.exports = {
  getAllUsuarios,
  getUsuarioPorCredenciales,
  actualizarContrasenna,
  olvidoContrasenna,
  crearOActualizarUsuario,
  EstadoUsuario,
  getUsuarioPorIdentificacion,
  cargarUsuario
};
