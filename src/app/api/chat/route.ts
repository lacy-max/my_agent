import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { gateway } from "@ai-sdk/gateway";
// OpenAI

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: gateway("anthropic/claude-sonnet-4.5"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
