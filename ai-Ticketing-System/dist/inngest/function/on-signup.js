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
import { sendMail } from "../../utils/mailer.js";
export const onUserSignup = inngest.createFunction({ id: "On-User-Signup", retries: 3 }, { event: "user/signup" }, (_a) => __awaiter(void 0, [_a], void 0, function* ({ event, step }) {
    try {
        const { email } = event.data;
        const User = yield step.run("get-user-email", () => __awaiter(void 0, void 0, void 0, function* () {
            const userObject = yield prisma.user.findFirst({
                where: {
                    email: email
                }
            });
            if (!userObject) {
                throw new NonRetriableError("User not found");
            }
            return userObject;
        }));
        yield step.run("send-email", () => __awaiter(void 0, void 0, void 0, function* () {
            const subject = "Welcome to our app";
            const Message = "Welcome ONBOARDING to our app";
            yield sendMail(User.email, subject, Message);
        }));
        return { success: true };
    }
    catch (e) {
        throw new Error("Error in onUserSignup");
    }
}));
