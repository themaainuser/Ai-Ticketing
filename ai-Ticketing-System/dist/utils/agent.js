var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createAgent, gemini } from "@inngest/agent-kit";
const analyzeAgent = (ticket) => __awaiter(void 0, void 0, void 0, function* () {
    const SupportAgent = createAgent({
        name: "Database administrator",
        system: `You are an expert AI assistant that processes technical support tickets.

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond with *only* valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.

Repeat: Do not wrap your output in markdown or code fences.`,
        model: gemini({
            model: "gemini-2.0-flash-lite",
            apiKey: process.env.GEMINI_API_KEY,
        }),
    });
    const response = yield SupportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.

Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

{
  "summary": "Short summary of the ticket",
  "priority": "high",
  "helpfulNotes": "Here are useful tips...",
  "relatedSkills": ["React", "Node.js"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`);
    if (!response.output || response.output.length === 0) {
        console.error("No output received from agent.");
        return null;
    }
    const message = response.output[0];
    if ("content" in message && typeof message.content === "string") {
        try {
            // Try to extract JSON inside ```json ... ``` or fallback to raw content
            const match = message.content.match(/```json\s*([\s\S]*?)\s*```/i);
            const jsonString = match ? match[1] : message.content.trim();
            return JSON.parse(jsonString);
        }
        catch (e) {
            console.error("Failed to parse JSON from AI response:", e.message);
            return null;
        }
    }
});
export default analyzeAgent;
