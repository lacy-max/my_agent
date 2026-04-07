"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import { useState } from "react";

function messageText(message: UIMessage): string {
  const text = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
  if (text.trim() !== "") return text;

  const weatherPart = message.parts.find((p) => p.type === "tool-getWeather");
  if (
    weatherPart &&
    "state" in weatherPart &&
    weatherPart.state === "output-available" &&
    "output" in weatherPart
  ) {
    const output = weatherPart.output as
      | { location?: string; temperature?: string | number; unit?: string }
      | undefined;
    if (output?.location && output?.temperature !== undefined) {
      return `${output.location} 当前温度 ${output.temperature}${output.unit ?? ""}`;
    }
  }

  if (
    weatherPart &&
    "state" in weatherPart &&
    weatherPart.state === "input-available"
  ) {
    return "正在查询天气…";
  }

  return "";
}

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  console.log(messages);

  const busy = status === "submitted" || status === "streaming";

  const last = messages[messages.length - 1];
  const assistantAlreadyStreaming =
    last?.role === "assistant" && messageText(last).trim() !== "";

  return (
    <div className="flex flex-col max-w-2xl mx-auto min-h-[calc(100dvh-11rem)] px-4 sm:px-6">
      <header className="py-4">天气</header>

      <div className="flex-1 overflow-y-auto space-y-4 py-6">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-900/40 px-6 py-10 text-center">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              在下方输入问题，按发送开始对话
            </p>
          </div>
        ) : null}

        {messages.map((message) => {
          const text = messageText(message);
          const isUser = message.role === "user";
          if (!isUser && text.trim() === "") {
            return null;
          }
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <article
                className={[
                  "max-w-[min(100%,28rem)] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm",
                  isUser
                    ? "bg-blue-600 text-white rounded-br-lg"
                    : "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-700/90 rounded-bl-lg",
                ].join(" ")}
              >
                <p className="whitespace-pre-wrap wrap-break-word">{text}</p>
              </article>
            </div>
          );
        })}

        {busy && !assistantAlreadyStreaming ? (
          <div className="flex justify-start">
            <div
              className="inline-flex items-center gap-2 rounded-2xl rounded-bl-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/90 px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400"
              aria-live="polite"
            >
              <span className="inline-flex gap-0.5" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 rounded-full bg-current opacity-70 animate-bounce"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </span>
              正在回复…
            </div>
          </div>
        ) : null}
      </div>

      <form
        className="sticky bottom-0 shrink-0 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-4 pb-8 bg-linear-to-t from-background from-70% to-transparent"
        onSubmit={(e) => {
          e.preventDefault();
          const t = input.trim();
          if (!t || busy) return;
          sendMessage({ text: t });
          setInput("");
        }}
      >
        <div className="flex gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm p-1.5 pl-4 shadow-lg shadow-zinc-900/4 dark:shadow-black/25">
          <input
            className="flex-1 min-w-0 bg-transparent py-3 text-[15px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
            value={input}
            placeholder="输入消息…"
            onChange={(e) => setInput(e.currentTarget.value)}
            disabled={busy}
            autoComplete="off"
            aria-label="消息输入"
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-45 disabled:pointer-events-none transition-colors"
          >
            发送
          </button>
        </div>
      </form>
    </div>
  );
}
