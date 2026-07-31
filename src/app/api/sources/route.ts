import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AVAILABLE_PROVIDERS } from "@/lib/crawlers";

export async function GET() {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: "desc" },
    include: { crawlRuns: { orderBy: { startedAt: "desc" }, take: 1 } },
  });
  return NextResponse.json(sources);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, provider, config } = body;

  if (!name || !provider) {
    return NextResponse.json({ error: "name and provider are required" }, { status: 400 });
  }
  if (!AVAILABLE_PROVIDERS.includes(provider)) {
    return NextResponse.json(
      { error: `Unknown provider "${provider}". Available: ${AVAILABLE_PROVIDERS.join(", ")}` },
      { status: 400 }
    );
  }

  const source = await prisma.source.create({
    data: {
      name,
      provider,
      config: config ? JSON.stringify(config) : null,
    },
  });
  return NextResponse.json(source, { status: 201 });
}
