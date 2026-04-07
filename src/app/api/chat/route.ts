// import { convertToModelMessages, streamText } from "ai";
// import {
//   createOpenAI,
//   type OpenAIChatLanguageModelOptions,
// } from "@ai-sdk/openai";

import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, tool } from "ai";
import z from "zod";

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();

//     const openai = createOpenAI({
//       apiKey: process.env.DASHSCOPE_API_KEY,
//       baseURL:
//         process.env.DASHSCOPE_BASE_URL ??
//         "https://dashscope.aliyuncs.com/compatible-mode/v1",
//     });

//     const modelId = process.env.DASHSCOPE_MODEL ?? "qwen3.6-plus";

//     const openaiOptions = {
//       reasoningEffort: "low",
//     } satisfies OpenAIChatLanguageModelOptions;
//     const result = streamText({
//       model: openai.chat(modelId),
//       messages: convertToModelMessages(messages),
//       providerOptions: {
//         openai: openaiOptions,
//       },
//     });

//     return result.toUIMessageStreamResponse();
//   } catch (error: unknown) {
//     console.error("Error:", error);
//     const message = error instanceof Error ? error.message : String(error);
//     return new Response(JSON.stringify({ error: message }), {
//       status: 500,
//     });
//   }
// }

export async function POST(req: Request) {
  try {
    const openai = createOpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL:
        process.env.DASHSCOPE_BASE_URL ??
        "https://dashscope.aliyuncs.com/compatible-mode/v1",
    });
    const { messages } = await req.json();
    const result = streamText({
      model: openai.chat("qwen-plus"),
      messages: convertToModelMessages(messages),
      providerOptions: {
        openai: {
          reasoningEffort: "low",
        },
      },
      tools: {
        getWeather: tool({
          description: "Get the weather for a given location",
          inputSchema: z.object({
            location: z.string(),
          }),
          execute: async ({ location }) => {
            const res = await fetch(`https://wttr.in/${location}?format=%t`);
            const tempText = await res.text();
            const match = tempText.match(/(-?\d+)°C/);
            const temperature = match ? parseInt(match[1]) : null;
            if (temperature === null) {
              return { error: `无法获取 ${location} 的天气` };
            }

            return {
              location,
              temperature,
              unit: "摄氏度",
            };
          },
        }),
      },
    });
    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}
