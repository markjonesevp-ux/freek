import { crawlerUserAgent } from "./robots";
import { scoreText, matchesIndustryOrSize } from "./scoring";
import { upsertLeadWithSignals } from "./persist";
import type { CrawlerContext, CrawlerResult } from "./types";

// RemoteOK publishes its listings as a public, unauthenticated JSON feed
// (https://remoteok.com/api) explicitly meant for programmatic consumption.
interface RemoteOkJob {
  company?: string;
  position?: string;
  description?: string;
  url?: string;
  tags?: string[];
}

export async function crawlRemoteOk(ctx: CrawlerContext): Promise<CrawlerResult> {
  const { config } = ctx;
  const limit = config.limit ?? 60;

  const res = await fetch("https://remoteok.com/api", {
    headers: { "User-Agent": crawlerUserAgent(), Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`RemoteOK API returned ${res.status}`);

  const data = (await res.json()) as RemoteOkJob[];
  // First element of the response is a legal/attribution notice, not a job.
  const jobs = data.filter((j) => j.position && j.company).slice(0, limit);

  let leadsFound = 0;
  for (const job of jobs) {
    const text = `${job.position} ${job.description ?? ""} ${(job.tags ?? []).join(" ")}`;
    const { signals: keywordSignals, crmDetected } = scoreText(text);
    const firmographicSignals = matchesIndustryOrSize(text, config.targetIndustries, config.targetEmployeeRange);
    const signals = [...keywordSignals, ...firmographicSignals];
    if (signals.length === 0) continue;

    await upsertLeadWithSignals({
      companyName: job.company!,
      sourceUrl: job.url,
      crmDetected,
      signals: signals.map((s) => ({ ...s, detail: s.detail ?? job.position })),
      crawlRunId: ctx.crawlRunId,
    });
    leadsFound++;
  }

  return { itemsFound: jobs.length, leadsFound };
}
