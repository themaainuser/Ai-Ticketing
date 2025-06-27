import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma'
import {serve} from "inngest/express"
import {inngest} from "./inngest/client"
import { onUserSignup } from "./inngest/function/on-signup"
import { onTicketCreate } from "./inngest/function/on-ticket-create"
import userRoutes from './routes/user'
import ticketRoutes from './routes/tickets'
import dotenv from "dotenv"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("api/auth", userRoutes)
app.use("api/ticket", ticketRoutes)

app.use("/api/ingest",
    serve({
        client: inngest,
        functions: [onUserSignup, onTicketCreate ]
    })
)

export const prisma = new PrismaClient()
prisma.$connect().then(()=>{
    console.log("connected to database");
    app.listen(3000,()=>{`server running on post 3000`})
}).catch((err)=>{
    console.log(err);
})