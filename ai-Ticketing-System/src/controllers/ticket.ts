import { inngest } from "../inngest/client.js";
import { Ticket, User } from "../../generated/prisma/index.js";
import { prisma } from "../index.js";


export const createTicket = async ( req: any, res: any ) =>{
    try{
        const { title, description} = req.body;
        if (!title || !description){
            return res.status(400).json({ Message: "Ticket title and description is required!!" })
        }
        const newTicket = await prisma.ticket.create({
            data: {
                title,
                description,
                status: "OPEN",
                //@ts-ignore
                createdBy: { id: req.user?.id?.toString() },
                priority: "LOW",
                deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
                // relatedSkills: req.user.skills,
            }
        })
        
        await inngest.send({
            name:"ticket/create",
            data:{
                ticketID: (await newTicket).id.toString(),
                title,
                description,
                createdBy: req.user.id.toString()
            }
        })
        return res.status(201).json({ Message: "Ticket created and processing started",ticket: newTicket })
        // return res.status(201).json({ ticket: newTicket })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ Message: "Internal Server Error" })
    }
}

export const getTickets = async (req: any, res: any) => {
    try{
       const user = req.user; //    const user = req.user as User; And then cast it more safely
       let tickets = []
//    if (user.role !== 'USER') {
//     tickets = await prisma.ticket.findMany({ });
//   }
       if (user.role !== 'USER') {
        tickets = await prisma.ticket.findMany({
          include: {
            assignee: {
              select: {
                email: true,
                id: true,
              },
            },
          },
          orderBy: { createdAt: 'desc', assignee: { email: 'desc' } },
        });
      }
      else { // else if (user.role === 'USER')
        tickets = await prisma.ticket.findMany({
          where: {
            assignedTo: user.id
          },
        //   include: {
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                deadline: true,
                createdAt: true,
                updatedAt: true, 
            },
            // assignee: {
            //   select: {
            //     id: true,
            //     email: true,
            //   },
            // },
        //   },
          orderBy: {
            createdAt: 'desc',
          },
        });
        if (!tickets) {
            return res.status(404).json({ Message: "No tickets found" })
        }
        res.status(200).json( tickets )
      }          
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ Message: "Internal Server Error" })
    }
}
export const getTicket = async (req: any, res: any) => {
    try{
       const user = req.user; //    const user = req.user as User; And then cast it more safely
       let ticket;
//    if (user.role !== 'USER') {
//     tickets = await prisma.ticket.findMany({ });
//   }
       if (user.role !== 'USER') {
        ticket = await prisma.ticket.findMany({
          include: {
            assignee: {
              select: {
                email: true,
                id: true, 
              },
            },
          },
          orderBy: { createdAt: 'desc', assignee: { email: 'desc' } },
        });
      }
      else { // else if (user.role === 'USER')
        ticket = await prisma.ticket.findFirst({
          where: {
            assignedTo: user.id
          },
        //   include: {
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                deadline: true,
                createdAt: true,
                updatedAt: true, 
            },
            // assignee: {
            //   select: {
            //     id: true,
            //     email: true,
            //   },
            // },
        //   },
          orderBy: {
            createdAt: 'desc',
          },
        });
        if (!ticket) {
            return res.status(404).json({ Message: "No tickets found" })
        }
        res.status(200).json( ticket )
      }          
    }
    catch(error){
        console.error(error)
        return res.status(500).json({ Message: "Internal Server Error" })
    }
}
