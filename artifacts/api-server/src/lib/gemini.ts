import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { GenerateFeedbackResponse } from "@workspace/api-zod";
import { logger } from "./logger";

type Feedback = z.infer<typeof GenerateFeedbackResponse>;

const MODEL = "gemini-3.6-flash";

const SYSTEM_INSTRUCTIONS = `You are OutLoud, an interview speaking practice coach.

Your goal is to help job seekers improve how they articulate answers in English during realistic interview conversations.

Evaluate ONLY the user's spoken response as represented by the transcript.

Evaluate:
1. Clarity
2. Structure
3. Relevance to the question
4. Professional word choice
5. Filler-word usage
6. Conciseness
7. Ability to communicate the main point clearly

Do NOT evaluate:
- appearance
- attractiveness
- race or ethnicity
- accent as an identity characteristic
- eye contact
- body language
- facial expressions
- personality
- intelligence
- confidence as a personal trait
- grammar perfection as the primary goal

Do not shame, embarrass, insult, or discourage the user.

The user may have imperfect English. Focus on whether their meaning is understandable and how they can communicate it more clearly and professionally.

Give practical feedback that encourages the user to try answering the same question again.

IMPORTANT:
Return ONLY valid JSON matching the requested schema.
Do not return Markdown.
Do not add commentary outside the JSON.

FEEDBACK RULES:

WHAT WENT WELL:
Identify 1-2 genuine strengths from the actual response.
Do not invent strengths that are not supported by the transcript.

FOCUS ON:
Identify a maximum of 2 high-value improvements.
Prioritize improvements that are most useful for the user's next attempt.

TRY SAYING IT THIS WAY:
Provide a concise example of how the user's idea could be expressed more clearly or professionally.
Do not completely rewrite the answer into a perfect artificial response.
Preserve the user's intended meaning.

WHY:
Briefly explain why the suggested version is clearer or more effective.

If the transcript is extremely short, unclear, or empty:
- Do not fabricate feedback.
- Return useful but gentle feedback explaining that there is not enough content to evaluate.
- Encourage the user to try again.

JSON SCHEMA:

{
  "whatWentWell": {
    "summary": "string",
    "tags": ["string", "string"]
  },
  "focusOn": [
    {
      "title": "string",
      "description": "string",
      "example": {
        "youSaid": "string",
        "tryInstead": "string"
      }
    }
  ],
  "trySayingItThisWay": {
    "suggestion": "string",
    "why": "string"
  }
}`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    whatWentWell: {
      type: "object",
      properties: {
        summary: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
      },
      required: ["summary", "tags"],
    },
    focusOn: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          example: {
            type: "object",
            properties: {
              youSaid: { type: "string" },
              tryInstead: { type: "string" },
            },
            required: ["youSaid", "tryInstead"],
          },
        },
        required: ["title", "description", "example"],
      },
    },
    trySayingItThisWay: {
      type: "object",
      properties: {
        suggestion: { type: "string" },
        why: { type: "string" },
      },
      required: ["suggestion", "why"],
    },
  },
  required: ["whatWentWell", "focusOn", "trySayingItThisWay"],
} as const;

export class GeminiNotConfiguredError extends Error {
  constructor() {
    super("GEMINI_API_KEY is not configured");
    this.name = "GeminiNotConfiguredError";
  }
}

export class GeminiFeedbackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiFeedbackError";
  }
}

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) {
    throw new GeminiNotConfiguredError();
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export async function generateInterviewFeedback(
  question: string,
  transcript: string,
): Promise<Feedback> {
  const ai = getClient();

  const userPrompt = `Interview question: ${question}\n\nCandidate's transcribed spoken response: ${
    transcript.trim() ? transcript : "(no speech was captured)"
  }`;

  let text: string | undefined;
  try {
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });
    text = result.text;
  } catch (err) {
    logger.error({ err }, "Gemini request failed");
    throw new GeminiFeedbackError("Gemini request failed");
  }

  if (!text) {
    throw new GeminiFeedbackError("Gemini returned an empty response");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch (err) {
    logger.error({ err }, "Gemini returned invalid JSON");
    throw new GeminiFeedbackError("Gemini returned invalid JSON");
  }

  const validated = GenerateFeedbackResponse.safeParse(parsedJson);
  if (!validated.success) {
    logger.error(
      { errors: validated.error.message },
      "Gemini response failed schema validation",
    );
    throw new GeminiFeedbackError("Gemini response failed schema validation");
  }

  return validated.data;
}
