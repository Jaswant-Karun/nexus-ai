import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDiagram = ["mermaid", "diagram", "workflow", "flowchart"].includes(lang.toLowerCase());

  if (isDiagram) {
    const diagramLines = code
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("graph") && !l.startsWith("flowchart"));

    return (
      <div className="my-4 rounded-2xl border border-brand-500/25 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400 text-xs font-bold">
              🗺️
            </span>
            <span className="text-xs font-bold text-white tracking-wide uppercase">Workflow & Architecture Diagram</span>
          </div>
          <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-brand-400 border border-brand-500/20">
            Visual Flow
          </span>
        </div>

        {/* Visual node flowchart cards */}
        <div className="space-y-3">
          {diagramLines.map((line, idx) => {
            const parts = line.split(/-->|->|==>/).map((p) => p.replace(/[\[\]\(\)\{\}"]/g, "").trim());

            return (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 text-xs font-medium">
                {parts.map((part, pIdx) => (
                  <React.Fragment key={pIdx}>
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-white shadow-md transition-all hover:border-brand-500/40 hover:bg-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand-400 shrink-0" />
                        <span className="font-semibold text-dark-100">{part}</span>
                      </div>
                    </div>
                    {pIdx < parts.length - 1 && (
                      <div className="flex items-center justify-center text-brand-400 font-bold px-1 py-1 shrink-0">
                        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="rotate-90 sm:rotate-0">
                          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            );
          })}
        </div>

        {/* Raw Mermaid code collapsible toggle */}
        <details className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-dark-400">
          <summary className="cursor-pointer font-mono hover:text-brand-300 transition-colors">
            View Raw Diagram Source
          </summary>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-dark-950 p-3 font-mono text-dark-300 text-[11px]">
            {code}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-xl border border-white/[0.08] bg-dark-950 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 text-[11px] font-mono text-dark-400 border-b border-white/[0.06] bg-dark-900/90">
        <span>{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {copied ? "✓ Copied" : "Copy Code"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs font-mono text-dark-100 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block / Diagram
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <CodeBlock key={i} code={codeLines.join("\n")} lang={lang} />
      );
    }
    // Markdown Table
    else if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      i--; // adjust loop counter

      if (tableLines.length >= 2) {
        const parseRow = (rowStr: string) =>
          rowStr
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());

        const headers = parseRow(tableLines[0]);
        const isSeparator = tableLines[1].includes("---") || tableLines[1].includes(":---");
        const bodyRows = (isSeparator ? tableLines.slice(2) : tableLines.slice(1)).map(parseRow);

        elements.push(
          <div key={i} className="my-4 overflow-x-auto rounded-xl border border-white/[0.08] bg-dark-900/60 shadow-lg">
            <table className="w-full text-left text-xs text-dark-100 border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.04]">
                  {headers.map((h, idx) => (
                    <th key={idx} className="px-4 py-3 font-semibold text-white uppercase tracking-wider text-[11px]">
                      {inline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5 leading-relaxed text-dark-200">
                        {inline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
    // Headings
    else if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^(#+)/)![1].length;
      const text = line.replace(/^#+\s/, "");
      const sizeClasses: Record<number, string> = {
        1: "text-2xl font-black text-white my-4 border-b border-white/[0.06] pb-2",
        2: "text-xl font-extrabold text-white my-3.5",
        3: "text-lg font-bold text-brand-300 my-3",
        4: "text-base font-semibold text-white my-2.5",
        5: "text-sm font-semibold text-white my-2",
        6: "text-xs font-semibold text-white my-1.5",
      };
      const headingClass = sizeClasses[level];
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
        <blockquote key={i} className="my-3 border-l-3 border-brand-500/70 pl-4 py-1 text-sm text-dark-200 bg-brand-500/5 rounded-r-xl italic">
          {inline(line.slice(2))}
        </blockquote>
      );
    }
    // Unordered list item
    else if (/^[-*+]\s/.test(line)) {
      elements.push(
        <li key={i} className="ml-5 list-disc text-sm text-dark-100 leading-relaxed my-1">
          {inline(line.replace(/^[-*+]\s/, ""))}
        </li>
      );
    }
    // Task check items
    else if (/^-\s\[[ xX]\]\s/.test(line)) {
      const checked = line.includes("[x]") || line.includes("[X]");
      const itemText = line.replace(/^-\s\[[ xX]\]\s/, "");
      elements.push(
        <div key={i} className="flex items-center gap-2.5 my-1.5 ml-2 text-sm text-dark-100">
          <span className={cn("h-4 w-4 rounded flex items-center justify-center text-[10px] font-bold border", checked ? "bg-brand-600 border-brand-500 text-white" : "border-white/20 bg-dark-900")}>
            {checked ? "✓" : ""}
          </span>
          <span className={cn(checked && "line-through opacity-80")}>{inline(itemText)}</span>
        </div>
      );
    }
    // Ordered list item
    else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={i} className="ml-5 list-decimal text-sm text-dark-100 leading-relaxed my-1">
          {inline(line.replace(/^\d+\.\s/, ""))}
        </li>
      );
    }
    // Horizontal rule
    else if (/^---+$/.test(line.trim())) {
      elements.push(<hr key={i} className="my-4 border-white/[0.08]" />);
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
    <div className={cn("prose-nexus space-y-1", className)}>
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
      return <code key={i} className="rounded bg-brand-500/15 border border-brand-500/20 px-1.5 py-0.5 font-mono text-[11px] text-brand-300">{part.slice(1, -1)}</code>;
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch)
      return <a key={i} href={linkMatch[2]} className="text-brand-400 underline underline-offset-2 hover:text-brand-300 transition-colors" target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>;
    return part;
  });
}
