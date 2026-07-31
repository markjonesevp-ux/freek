import { XMLParser } from "fast-xml-parser";
import { crawlerUserAgent } from "./robots";
import { scoreText, matchesIndustryOrSize } from "./scoring";
import { upsertLeadWithSignals } from "./persist";
import type { CrawlerContext, CrawlerResult } from "./types";

// We Work Remotely publishes public RSS feeds per category, intended for
// syndication (e.g. https://weworkremotely.com/categories/remote-programming-jobs.rss).
const DEFAULT_FEEDS = [
  "https://weworkremotely.com/categories/remote-programming-jobs.rss",
  "https://weworkremotely.com/categories/remote-sales-and-marketing-jobs.rss",
];

interface RssItem {
  title?: string;
  description?: string;
  link?: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractCompany(title: string): string {
  // WWR titles are formatted "Company: Job Title"
  const [company] = title.split(":");
  return company?.trim() || title.trim();
}

export async function crawlWeWorkRemotely(ctx: CrawlerContext): Promise<CrawlerResult> {
  const { config } = ctx;
  const feeds = config.urls?.length ? config.urls : DEFAULT_FEEDS;
  const limit = config.limit ?? 60;

  const parser = new XMLParser();
  let itemsFound = 0;
  let leadsFound = 0;

  for (const feedUrl of feeds) {
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": crawlerUserAgent() },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) continue;

    const xml = await res.text();
    const parsed = parser.parse(xml);
    const items: RssItem[] = parsed?.rss?.channel?.item ?? [];
    const list = Array.isArray(items) ? items : [items];

    for (const rawItem of list.slice(0, limit)) {
      itemsFound++;
      const title = String(rawItem.title ?? "");
      const description = stripHtml(String(rawItem.description ?? ""));
      const text = `${title} ${description}`;

      const { signals: keywordSignals, crmDetected } = scoreText(text);
      const firmographicSignals = matchesIndustryOrSize(text, config.targetIndustries, config.targetEmployeeRange);
      const signals = [...keywordSignals, ...firmographicSignals];
      if (signals.length === 0) continue;

      await upsertLeadWithSignals({
        companyName: extractCompany(title),
        sourceUrl: rawItem.link,
        crmDetected,
        signals: signals.map((s) => ({ ...s, detail: s.detail ?? title })),
        crawlRunId: ctx.crawlRunId,
      });
      leadsFound++;
    }
  }

  return { itemsFound, leadsFound };
}
