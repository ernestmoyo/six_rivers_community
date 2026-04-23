"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Which IGA groups are struggling and why?",
  "Summarize this quarter's wildlife incidents",
  "Which villages have the lowest seedling survival?",
  "What's our overall impact on human-wildlife coexistence?",
];

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
        { role: "assistant", content: data.answer ?? "(no response)" },
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
    <Card className="border-2 border-dashed border-primary/30">
      <CardContent className="p-5">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary">Ask the data</p>
            <p className="text-xs text-muted-foreground">
              Ask natural-language questions about the programme — powered by AI
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{open ? "Close" : "Open"}</span>
        </button>

        {open && (
          <div className="mt-4 flex flex-col gap-3">
            {/* Suggested questions */}
            {messages.length === 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Try one of these
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => ask(q)}
                      disabled={loading}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs transition hover:border-accent hover:bg-accent/5"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation */}
            {messages.length > 0 && (
              <div
                ref={scrollRef}
                className="flex max-h-96 flex-col gap-3 overflow-y-auto rounded-md border border-border bg-muted/30 p-3"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user"
                        ? "self-end rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground max-w-md"
                        : "self-start rounded-lg bg-background px-3 py-2 text-sm shadow-sm max-w-md border border-border whitespace-pre-wrap"
                    }
                  >
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div className="self-start flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-sm shadow-sm border border-border">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                )}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex gap-2"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about farmers, IGA groups, wildlife, villages..."
                rows={2}
                disabled={loading}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
              />
              <Button type="submit" disabled={loading || !input.trim()} className="gap-1.5">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Ask
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
