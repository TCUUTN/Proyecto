const nodemailer = require('nodemailer');
require('dotenv').config();

const enviarCorreo = async (destinatario, asunto, mensajeHtml) => {
  try {
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

module.exports = {
  enviarCorreo
};
