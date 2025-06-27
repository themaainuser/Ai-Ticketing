var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// type sendMail = {
//     to : string,
//     subject : string,
//     text : string,
//     html ?: string,
// }
export const sendMail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_TRAP_SMTP_HOST || '',
            port: Number(process.env.MAIL_TRAP_SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_TRAP_SMTP_USER,
                pass: process.env.MAIL_TRAP_SMTP_PASS,
            },
        });
        const info = yield transporter.sendMail({
            from: 'noreplay from tms',
            to,
            subject,
            text
        });
        console.log("Message sent:", info.messageId);
        return info;
    }
    catch (err) {
        console.error(err);
    }
});
