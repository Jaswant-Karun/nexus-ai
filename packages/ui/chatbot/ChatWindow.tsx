"use client";

import { useState } from "react";
import type { Message } from "@nexus/types";

export interface ChatWindowProps {
  initialMessages?: Message[];
  agentName?: string;
  onSendMessage?: (content: string) => void;
  isLoading?: boolean;
}

export function ChatWindow({
  initialMessages = [],
  agentName = "Nexus Assistant",
  onSendMessage,
  isLoading = false,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: "conv_1",
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev: Message[]) => [...prev, userMsg]);
    onSendMessage?.(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-semibold text-white">{agentName}</h3>
        </div>
        <span className="text-xs text-gray-400">GPT-4o / Claude 3.5 Sonnet</span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg"
                  : "bg-gray-900 border border-gray-800 text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 text-sm text-cyan-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Agent is processing thought graph...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900/30 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Nexus AI agent anything..."
          className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={handleSend}
          type="button"
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-medium text-sm rounded-lg transition-all shadow-md shadow-cyan-500/20"
        >
          Send
        </button>
      </div>
    </div>
  );
}
