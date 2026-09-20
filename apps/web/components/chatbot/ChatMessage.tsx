import { cn } from "@/lib/utils";
import { Avatar } from "@/components/common/Avatar";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string;
}

interface ChatMessageProps {
  message: Message;
  agentName?: string;
  userName?: string;
  className?: string;
}

export function ChatMessage({
  message,
  agentName = "Nexus AI",
  userName = "You",
  className,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser && "flex-row-reverse",
        className
      )}
    >
      <Avatar
        name={isUser ? userName : agentName}
        size="sm"
        className={cn(!isUser && "bg-gradient-to-br from-brand-500 to-purple-600")}
      />

      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-brand-600/20 text-white border border-brand-500/20 rounded-tr-sm"
            : "glass-dark text-dark-100 rounded-tl-sm"
        )}
      >
        <p className={cn("mb-1 text-[10px] font-semibold uppercase tracking-wide",
          isUser ? "text-brand-400" : "text-dark-400"
        )}>
          {isUser ? userName : agentName}
        </p>
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.createdAt && (
          <p className="mt-1.5 text-[10px] text-dark-500 text-right">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
    </div>
  );
}
