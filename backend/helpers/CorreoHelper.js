const nodemailer = require('nodemailer');
require('dotenv').config();


//Proceso para enviar un correo sin adjunto
const enviarCorreo = async (destinatario, asunto, mensajeHtml) => {
  try {
    console.log(process.env.EMAIL_USER)
    console.log(process.env.EMAIL_PASS)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false // Permitir certificados autofirmados
        }

      });
      

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      html: mensajeHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};


//Proceso para enviar un correo con adjunto
const enviarCorreoConAdjunto = async (destinatarios, asunto, mensajeHtml, filePath, fileName, copia) => {
  try {
      const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          },
          tls: {
              rejectUnauthorized: false
          }
      });

      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: destinatarios,
          cc: copia,
          subject: asunto,
          html: mensajeHtml,
          attachments: [
              {
                  filename: fileName,
                  path: filePath
              }
          ]
      };

      await transporter.sendMail(mailOptions);
      console.log('Correo enviado exitosamente');
  } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw error;
  }
};

module.exports = {
  enviarCorreo,
  enviarCorreoConAdjunto
};
