import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildDataSnapshot } from "@/lib/data-snapshot";

interface AskPayload {
  question: string;
  mode?: "ask" | "highlights"; // "ask" = user Q&A, "highlights" = generate PDF narrative
}

const SYSTEM_PROMPT = `You are the Six Rivers Community Intelligence assistant. You analyze community-development data for Six Rivers Africa, a conservation NGO operating near Nyerere and Ruaha National Parks in southern Tanzania.

Your answers must be:
- Honest and grounded in the JSON data snapshot provided
- Quantitative when possible (cite specific numbers, village names, group names)
- Concise: 2-4 short paragraphs for Q&A, or 4-6 bullet points for highlights
- M&E-focused: donors and programme managers are the audience
- Neutral on attribution — don't invent staff names or claim credit

If a question can't be answered from the snapshot, say so directly instead of guessing.

When generating "highlights" for a quarterly report, lead with the strongest outcome numbers, call out risks honestly (dropouts, struggling groups, survival rates below 60%), and keep each bullet under 25 words.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI not configured. Add ANTHROPIC_API_KEY to .env" },
      { status: 503 }
    );
  }

  try {
    const body = (await req.json()) as AskPayload;
    if (!body.question || typeof body.question !== "string") {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const snapshot = buildDataSnapshot();
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: body.mode === "highlights" ? 600 : 800,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
        {
          type: "text",
          text: `Here is the current data snapshot (cached between requests):\n\n${JSON.stringify(
            snapshot,
            null,
            2
          )}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content:
            body.mode === "highlights"
              ? `Generate 5 punchy key highlights for the donor quarterly report, using real numbers from the snapshot. Start each with a bold achievement and close with one honest caveat or risk. Format: plain text, one bullet per line starting with "• ". No intro or outro.`
              : body.question,
        },
      ],
    });

    // Extract text content from the response
    const text =
      response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n") ?? "";

    return NextResponse.json({
      answer: text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cache_creation_input_tokens: response.usage.cache_creation_input_tokens ?? 0,
        cache_read_input_tokens: response.usage.cache_read_input_tokens ?? 0,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
