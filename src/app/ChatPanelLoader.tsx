"use client";

import dynamic from "next/dynamic";

const ChatPanel = dynamic(() => import("./ChatPanel"), {
  ssr: false,
  loading: () => (
    <div
      className="flex flex-col max-w-2xl mx-auto min-h-[calc(100dvh-11rem)] px-4 sm:px-6"
      aria-busy="true"
    >
      <div className="shrink-0 py-6 border-b border-zinc-200/90 dark:border-zinc-800 animate-pulse">
        <div className="h-7 w-20 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-4 w-56 rounded-md bg-zinc-100 dark:bg-zinc-800 mt-3" />
      </div>
      <div className="flex-1 py-6 animate-pulse">
        <div className="h-36 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-900/40" />
      </div>
      <div className="pt-4 pb-8 animate-pulse">
        <div className="h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  ),
});

export default function ChatPanelLoader() {
  return <ChatPanel />;
}
