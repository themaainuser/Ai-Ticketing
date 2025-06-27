import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/index.js';
import { serve } from "inngest/express"
import { inngest } from "./inngest/client.js"
import { onUserSignup } from "./inngest/function/on-signup.js"
import { onTicketCreate } from "./inngest/function/on-ticket-create.js"
import userRoutes from './routes/user.js'
import ticketRoutes from './routes/tickets.js'
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
}).catch((err: any)=>{

    console.log(err);
})