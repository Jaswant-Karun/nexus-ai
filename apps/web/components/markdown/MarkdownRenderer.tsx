import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Lightweight markdown renderer — no external deps needed.
 * Handles: headings, bold, italic, inline code, code blocks, lists, blockquotes, links.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} className="my-4 rounded-xl border border-white/[0.06] bg-dark-950 overflow-hidden">
          {lang && <div className="px-4 py-1.5 text-[10px] font-mono text-dark-400 border-b border-white/[0.06] bg-dark-900">{lang}</div>}
          <pre className="overflow-x-auto p-4 text-xs font-mono text-dark-100 leading-relaxed">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
    }
    // Headings
    else if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^(#+)/)![1].length;
      const text = line.replace(/^#+\s/, "");
      const sizeClasses: Record<number, string> = { 1: "text-2xl", 2: "text-xl", 3: "text-lg", 4: "text-base", 5: "text-sm", 6: "text-xs" };
      const headingClass = `font-bold text-white my-3 ${sizeClasses[level]}`;
      const headingContent = inline(text);
      const headingEl =
        level === 1 ? <h1 key={i} className={headingClass}>{headingContent}</h1> :
        level === 2 ? <h2 key={i} className={headingClass}>{headingContent}</h2> :
        level === 3 ? <h3 key={i} className={headingClass}>{headingContent}</h3> :
        level === 4 ? <h4 key={i} className={headingClass}>{headingContent}</h4> :
        level === 5 ? <h5 key={i} className={headingClass}>{headingContent}</h5> :
                      <h6 key={i} className={headingClass}>{headingContent}</h6>;
      elements.push(headingEl);
    }
    // Blockquote
    else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="my-3 border-l-2 border-brand-500/50 pl-4 text-sm text-dark-300 italic">
          {inline(line.slice(2))}
        </blockquote>
      );
    }
    // Unordered list item
    else if (/^[-*+]\s/.test(line)) {
      elements.push(
        <li key={i} className="ml-5 list-disc text-sm text-dark-100 leading-relaxed my-0.5">
          {inline(line.replace(/^[-*+]\s/, ""))}
        </li>
      );
    }
    // Ordered list item
    else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={i} className="ml-5 list-decimal text-sm text-dark-100 leading-relaxed my-0.5">
          {inline(line.replace(/^\d+\.\s/, ""))}
        </li>
      );
    }
    // Horizontal rule
    else if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} className="my-4 border-white/[0.06]" />);
    }
    // Empty line
    else if (line.trim() === "") {
      elements.push(<br key={i} />);
    }
    // Paragraph
    else {
      elements.push(
        <p key={i} className="text-sm text-dark-100 leading-relaxed my-1.5">
          {inline(line)}
        </p>
      );
    }

    i++;
  }

  return (
    <div className={cn("prose-nexus", className)}>
      {elements}
    </div>
  );
}

/** Inline markdown: bold, italic, code, links */
function inline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i} className="italic text-dark-200">{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="rounded bg-dark-800 px-1.5 py-0.5 font-mono text-[11px] text-brand-300">{part.slice(1, -1)}</code>;
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch)
      return <a key={i} href={linkMatch[2]} className="text-brand-400 underline underline-offset-2 hover:text-brand-300 transition-colors" target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>;
    return part;
  });
}
