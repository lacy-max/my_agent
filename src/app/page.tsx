"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* 渲染消息列表 */}
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          <strong>{message.role === "user" ? "User: " : "AI: "}</strong>
          {/* 渲染消息的各个部分 */}
          {message.parts?.map((part, i) => {
            switch (part.type) {
              case "text":
                return <div key={i}>{part.text}</div>;
              default:
                return null;
            }
          })}
        </div>
      ))}

      {/* 输入表单 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput("");
          }
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-300 rounded"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.currentTarget.value)}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
