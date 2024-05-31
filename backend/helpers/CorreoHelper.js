const nodemailer = require('nodemailer');

const enviarCorreo = async (destinatario, asunto, mensajeHtml) => {
  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'bitacoratcuutn@gmail.com', // Reemplaza con tu correo electrónico
          pass: 'ozau tzwo gjee uupt' // Reemplaza con tu contraseña
        },
        tls: {
            rejectUnauthorized: false // Permitir certificados autofirmados
        }

      });
      

    const mailOptions = {
      from: 'bitacoratcuutn@gmail.com',
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
