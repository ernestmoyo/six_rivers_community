"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Which IGA groups are struggling?",
  "Wildlife incidents this quarter?",
  "Lowest seedling survival villages?",
];

// Strip simple markdown so model output reads as clean prose
function clean(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1") // bold
    .replace(/\*(.+?)\*/g, "$1") // italics
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^[-=]{3,}\s*$/gm, "") // hr
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/^\s*[-*]\s+/gm, "• ") // bullets to bullet char
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function AskTheData() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function ask(question: string) {
    if (!question.trim() || loading) return;
    const userMsg: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, mode: "ask" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "AI not available");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: clean(data.answer ?? "(no response)") },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      toast.error("Could not reach the AI", { description: msg });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I couldn't answer that right now — ${msg}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating launcher button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask the data"
          className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg ring-2 ring-background transition hover:scale-105 hover:shadow-xl md:bottom-6 md:right-6"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      )}

      {/* Floating chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[min(92vw,360px)] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl md:bottom-6 md:right-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border bg-primary px-3 py-2 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Ask the data</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded p-1 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-2 p-3">
            {messages.length === 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Try one of these
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => ask(q)}
                      disabled={loading}
                      className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] transition hover:border-accent hover:bg-accent/5"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.length > 0 && (
              <div
                ref={scrollRef}
                className="flex max-h-72 flex-col gap-2 overflow-y-auto rounded-md bg-muted/30 p-2"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user"
                        ? "self-end rounded-lg bg-primary px-2.5 py-1.5 text-xs text-primary-foreground max-w-[85%]"
                        : "self-start rounded-lg bg-background px-2.5 py-1.5 text-xs shadow-sm max-w-[90%] border border-border whitespace-pre-wrap leading-relaxed"
                    }
                  >
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div className="self-start flex items-center gap-2 rounded-lg bg-background px-2.5 py-1.5 text-xs shadow-sm border border-border">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Thinking...
                  </div>
                )}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-end gap-1.5"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about farmers, groups, wildlife..."
                rows={1}
                disabled={loading}
                className="min-h-[36px] flex-1 resize-none text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading || !input.trim()}
                className="h-9 w-9 shrink-0 p-0"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
