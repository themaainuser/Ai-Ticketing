import express from "express";
import { createTicket, getTicket, getTickets } from "../controllers/ticket";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.get("/",auth, getTickets)
router.get("/:id",auth, getTicket)  
router.post("/",auth, createTicket)

export default router 