"use strict";
const nodemailer = require("nodemailer");



// async..await is not allowed in global scope, must use a wrapper
async function main() {

    // servidor
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email", // servidor smtp de nodemailer
        secure: true,
        port: 587, // puerto
        auth: {
            user: 'coy.sawayn71@ethereal.email',
            pass: 'Rw7bnzYXQ6bv4pTSYA'
        },
    });
  // enviamos el correo con objeto de transporte definido
    const info = await transporter.sendMail({
        from: "coy.sawayn71@ethereal.email", // sender address
        to: "coy.sawayn71@ethereal.email", // list of receivers
        subject: "Hello ✔", // titulo del correo
        text: "Hello world?", // el cuerpo del correo en forma de texto plano
        html: "<b>Hello world?</b>", // el cuerpo del correo en forma de html
    });

    console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

main().catch(console.error); // ejecutar la función, tiene un capturador de errores
