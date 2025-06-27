var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { inngest } from "../client.js";
import { prisma } from "../../index.js";
import { NonRetriableError } from "inngest";
import analyzeAgent from "../../utils/agent.js";
export const onTicketCreate = inngest.createFunction({ id: "On-Ticket-Create", retries: 3 }, { event: "ticket/create" }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ event, step }) {
    try {
        const { ticketId } = event.data;
        const ticket = yield step.run("get-userTicket", () => __awaiter(void 0, void 0, void 0, function* () {
            const ticketObject = yield prisma.ticket.findFirst({
                where: { id: ticketId }
            });
            if (!ticket) {
                throw new NonRetriableError("Ticket not found");
            }
            return ticketObject;
        }));
        yield step.run("update-ticket", () => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.ticket.update({
                where: {
                    id: ticket === null || ticket === void 0 ? void 0 : ticket.id
                },
                data: {
                    id: ticket === null || ticket === void 0 ? void 0 : ticket.id,
                    status: "OPEN"
                }
            });
        }));
        const aiResponse = yield analyzeAgent(ticket);
    }
    catch (error) {
    }
}));
