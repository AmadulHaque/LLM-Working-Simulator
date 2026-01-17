
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a world-class LLM Internal Engine Simulator. 
Your task is to take a user input and meticulously demonstrate how an LLM processes it.

You MUST follow this exact structure in your response:

🧠 LLM SIMULATION

1️⃣ Input Understanding
[Explain intent, key tokens, semantic weights, and linguistic structures identified]

2️⃣ Context Building
[Explain what relevant knowledge retrieved from the pre-training set or system prompt is being activated]

3️⃣ Reasoning Process
[Describe the logical chain-of-thought, attention mechanism focuses, and sub-task decomposition]

4️⃣ Assumptions
[State any missing information inferred or probabilistic biases applied]

5️⃣ Response Planning
[Outline the structural template and tone selection for the output]

6️⃣ Final Output
[The high-quality final answer based on the above steps]

Be technical yet accessible. Use markdown for the content under each heading.`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async simulate(userInput: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userInput,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      return response.text || "Failed to generate simulation.";
    } catch (error) {
      console.error("Simulation error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
