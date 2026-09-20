"use client";

import { NavBar, Sidebar, ChatWindow } from "@nexus/ui";

export default function ChatPage() {
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "📊" },
    { id: "chat", label: "AI Agent Studio", href: "/chat", icon: "🤖", active: true },
    { id: "workflow", label: "Workflow Builder", href: "/workflow", icon: "⚡" },
    { id: "workspace", label: "Knowledge Engine", href: "/workspace", icon: "🧠" },
    { id: "settings", label: "Platform Settings", href: "/settings", icon: "⚙️" },
  ];

  const initialMessages = [
    {
      id: "msg_1",
      conversationId: "conv_demo",
      role: "assistant" as const,
      content: "Hello! I am Nexus AI Agent. I can assist with dataset analysis, code review, workflow orchestration, or vector store queries. How can I help you today?",
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <NavBar brandName="NEXUS AI" />
      <div className="flex flex-1">
        <Sidebar
          items={sidebarItems}
          currentPath="/chat"
          onNavigate={(href) => {
            window.location.href = href;
          }}
        />

        <main className="flex-1 p-8 flex flex-col space-y-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Agent Studio</h1>
            <p className="text-gray-400 mt-1">Interact with state-of-the-art AI agents equipped with memory engine & dynamic tools.</p>
          </div>

          <div className="flex-1 min-h-[550px]">
            <ChatWindow
              agentName="Nexus Enterprise Agent (Orchestrator v1)"
              initialMessages={initialMessages}
              onSendMessage={(text) => {
                console.log("Sent message to agent:", text);
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
