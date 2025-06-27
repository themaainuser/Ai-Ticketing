var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { inngest } from "../inngest/client.js";
import { prisma } from "../index.js";
export const createTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ Message: "Ticket title and description is required!!" });
        }
        const newTicket = yield prisma.ticket.create({
            data: {
                title,
                description,
                status: "OPEN",
                //@ts-ignore
                createdBy: { id: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString() },
                priority: "LOW",
                deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
                // relatedSkills: req.user.skills,
            }
        });
        yield inngest.send({
            name: "ticket/create",
            data: {
                ticketID: (yield newTicket).id.toString(),
                title,
                description,
                createdBy: req.user.id.toString()
            }
        });
        return res.status(201).json({ Message: "Ticket created and processing started", ticket: newTicket });
        // return res.status(201).json({ ticket: newTicket })
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ Message: "Internal Server Error" });
    }
});
export const getTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; //    const user = req.user as User; And then cast it more safely
        let tickets = [];
        //    if (user.role !== 'USER') {
        //     tickets = await prisma.ticket.findMany({ });
        //   }
        if (user.role !== 'USER') {
            tickets = yield prisma.ticket.findMany({
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
            tickets = yield prisma.ticket.findMany({
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
                return res.status(404).json({ Message: "No tickets found" });
            }
            res.status(200).json(tickets);
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ Message: "Internal Server Error" });
    }
});
export const getTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; //    const user = req.user as User; And then cast it more safely
        let ticket;
        //    if (user.role !== 'USER') {
        //     tickets = await prisma.ticket.findMany({ });
        //   }
        if (user.role !== 'USER') {
            ticket = yield prisma.ticket.findMany({
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
            ticket = yield prisma.ticket.findFirst({
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
                return res.status(404).json({ Message: "No tickets found" });
            }
            res.status(200).json(ticket);
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ Message: "Internal Server Error" });
    }
});
