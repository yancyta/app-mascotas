const { response } = require('express');
const nodeMailer = require("nodemailer");
const Usuario = require("../modelos/usuario");
const jwt = require('jsonwebtoken');
const { generarJWT } = require("../helpers/jwt");

require("dotenv").config();

const forgotPassword = async (req, res=response)=> {
  const { email } = req.body;
    if (req.body.email === "") {
      res.status(400).json({
        ok: false,
        msg: "El corrreo es requerido",
      });
    }
  const msg='Check your email for a link to reset your password.';

    try {
       // const    users =await Usuario.findOneOrFail({where:{email:email}});
      const usuario = await Usuario.findOne({email});
      
      console.log("llego");
      if (!usuario) {
        return res.status(403).json({
          ok: false,
          msg: msg, // "El corrreo no existe",
        });
      }
        console.log("llego aqui");
      
      //const token = generarJWT(suaurio.id, usuario.email);
  
   
      const token = jwt.sign({uid:usuario.id,email:usuario.email},process.env.JWT_SECRET,{expiresIn: '10m'});
      // registrar el token en la base de datos
      usuario.update({
        resetToken: token
      })
      
      const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
          email: `${process.env.EMAIL_ADRESS}`,
          pass: `${process.env.EMAIL_PASSWAOR}`,
        },
      });

      const emailPort = process.env.PORT || 3000;
      //este es el link que se envía por email
      linkVerificacion=`http://localhost:${emailPort}/resetpassword/${usuario.id}/${token}`;
     console.log(`http://localhost:${emailPort}/resetpassword/${usuario.id}/${token}`);
      const mailOptions = {
        from: "yemmolina.ym@gmail.com",
        to: `${usuario.email}`,
        subject: "Enlace para recuperar su cuenta",
        text: `http://localhost:${emailPort}/resetpassword/${usuario.id}/${token}`,
      };
      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log("Haqui va");
          return res.status(400).json({
            ok: false,
            msg: "Ha ocurrido un error",
          });
        } else {
          console.log("Respuesta:", response);
          res.status(200).json({
            ok: true,
            msg: "El email para recuperación ha sido enviado",
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: "en el catch Ha ocurrido un error",
      });
    }
  };
const createNewPassw= async (req, res=response) => {
    const { newPassword} =req.body;    
    const resetToken =req.headers.reset; 
   if(!(resetToken && newPassword)){
    return res.status(400).json({
      ok: false,
      msg: "Campos requeridos",
    });

   }
   Usuario



  }





module.exports = {
    forgotPassword,
    createNewPassw   
}
