import { inngest } from "../client";
import { prisma } from "../../index";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer";

export const onUserSignup = inngest.createFunction(
  { id: "On-User-Signup", retries:3 },
  { event: "user/signup" },
  async ({event, step})=>{
    try{
        const {email} = event.data;
        const User = await step.run("get-user-email", async ()=>{
            const userObject = await prisma.user.findFirst({
                where: {
                    email: email
                }
            });
            if(!userObject){
                throw new NonRetriableError("User not found");
            }
            return userObject;
        })
        await step.run("send-email",async ()=>{
            const subject = "Welcome to our app";
            const Message = "Welcome ONBOARDING to our app";
            await sendMail(User.email, subject, Message)
        })
        return {success: true}
    }
    catch(e){
      throw new Error("Error in onUserSignup")
    }
  }
)