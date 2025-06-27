import nodemailer from 'nodemailer';

// type sendMail = {
//     to : string,
//     subject : string,
//     text : string,
//     html ?: string,
// }

export const sendMail = async (to: string, subject: string, text: string ) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_TRAP_SMTP_HOST || '',
            port: process.env.MAIL_TRAP_SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.MAIL_TRAP_SMTP_USER,
              pass: process.env.MAIL_TRAP_SMTP_PASS,
            },
          });
          const info = await transporter.sendMail({
            from: 'noreplay from tms',
            to,
            subject,
            text
          });
          console.log("Message sent:", info.messageId);
          return info;
    }
    catch(err){
     console.error(err);
    }

}