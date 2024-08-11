import { ChatOpenAI } from "@langchain/openai";

export const DEFAULT_GPT_MODEL = "gpt-4o";

export function gpt(...options: Partial<ConstructorParameters<typeof ChatOpenAI>>) {
  return new ChatOpenAI({
    verbose: true,
    modelName: DEFAULT_GPT_MODEL,
    maxTokens: 1024 * 4,
    callbacks: [
      {
        handleLLMNewToken: (token) => {
          if (process.env.LOG_LLM) {
            process.stdout.write(token);
          }
        },
      },
    ],
    ...options,
  });
}