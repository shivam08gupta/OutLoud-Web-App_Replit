import { Router, type IRouter } from "express";
import { GenerateFeedbackBody, GenerateFeedbackResponse } from "@workspace/api-zod";
import {
  generateInterviewFeedback,
  GeminiNotConfiguredError,
  GeminiFeedbackError,
} from "../lib/gemini";

const router: IRouter = Router();

router.post("/feedback", async (req, res): Promise<void> => {
  const parsed = GenerateFeedbackBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { question, transcript } = parsed.data;

  try {
    const feedback = await generateInterviewFeedback(question, transcript);
    res.json(GenerateFeedbackResponse.parse(feedback));
  } catch (err) {
    if (err instanceof GeminiNotConfiguredError) {
      req.log.error("Feedback request received but GEMINI_API_KEY is not configured");
      res.status(503).json({
        error:
          "AI feedback isn't configured yet. Set the GEMINI_API_KEY environment variable on the server.",
      });
      return;
    }
    if (err instanceof GeminiFeedbackError) {
      req.log.error({ err }, "Failed to generate AI feedback");
      res.status(502).json({
        error: "We couldn't generate feedback right now. Please try again.",
      });
      return;
    }
    req.log.error({ err }, "Unexpected error generating AI feedback");
    res.status(500).json({
      error: "We couldn't generate feedback right now. Please try again.",
    });
  }
});

export default router;
