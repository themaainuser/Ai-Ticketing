import { inngest } from "../client";
import { prisma } from "../../index";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer";
import analyzeAgent from "../../utils/agent";


export const onTicketCreate = inngest.createFunction(   
    {id: "On-Ticket-Create", retries:3},
    {event: "ticket/create"},
    async({event, step}) => {
        try{
        const {ticketId} = event.data;
        const ticket = await step.run("get-userTicket",async ()=>{
            const ticketObject = await prisma.ticket.findFirst({
                    where: { id: ticketId }
                })
            if (!ticket) {
                throw new NonRetriableError("Ticket not found");
            }
            return ticketObject;
            })
        await step.run("update-ticket", async() => {
            await prisma.ticket.update({
                where: {
                    id: ticket?.id    
                },
                data: {
                    id: ticket?.id,
                    status: "OPEN"
                }
            })
            })
            const aiResponse = await analyzeAgent(ticket);
            
        }

        catch(error: any){
            
        }
    }
)
