import { scoreText, matchesIndustryOrSize } from "./scoring";
import { upsertLeadWithSignals } from "./persist";
import type { CrawlerContext, CrawlerResult } from "./types";

// Uses Algolia's public HN Search API (https://hn.algolia.com/api), a
// documented, unauthenticated API over Hacker News data - not a scrape.
interface AlgoliaHit {
  objectID: string;
  title?: string;
}

interface AlgoliaItem {
  id: number;
  author?: string;
  text?: string | null;
  children?: AlgoliaItem[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/g, "/")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function guessCompanyName(text: string, author?: string): string {
  const firstChunk = text.split(/\n|\s\|\s|\s—\s|\s-\s/)[0].trim();
  if (firstChunk.length >= 2 && firstChunk.length <= 80) return firstChunk;
  return `HN hiring post by ${author ?? "unknown"}`;
}

export async function crawlHnHiring(ctx: CrawlerContext): Promise<CrawlerResult> {
  const { config } = ctx;
  const limit = config.limit ?? 150;

  const searchRes = await fetch(
    "https://hn.algolia.com/api/v1/search_by_date?tags=story&query=Who%20is%20hiring",
    { signal: AbortSignal.timeout(15000) }
  );
  if (!searchRes.ok) throw new Error(`HN Algolia search returned ${searchRes.status}`);
  const searchData = (await searchRes.json()) as { hits: AlgoliaHit[] };
  const story = searchData.hits?.find((h) => /who is hiring/i.test(h.title ?? ""));
  if (!story) return { itemsFound: 0, leadsFound: 0 };

  const itemRes = await fetch(`https://hn.algolia.com/api/v1/items/${story.objectID}`, {
    signal: AbortSignal.timeout(20000),
  });
  if (!itemRes.ok) throw new Error(`HN Algolia item returned ${itemRes.status}`);
  const item = (await itemRes.json()) as AlgoliaItem;
  const comments = (item.children ?? []).filter((c) => c.text).slice(0, limit);

  let leadsFound = 0;
  for (const comment of comments) {
    const text = stripHtml(comment.text!);
    if (!text) continue;

    const { signals: keywordSignals, crmDetected } = scoreText(text);
    const firmographicSignals = matchesIndustryOrSize(text, config.targetIndustries, config.targetEmployeeRange);
    const signals = [...keywordSignals, ...firmographicSignals];
    if (signals.length === 0) continue;

    await upsertLeadWithSignals({
      companyName: guessCompanyName(text, comment.author),
      sourceUrl: `https://news.ycombinator.com/item?id=${comment.id}`,
      crmDetected,
      signals,
      crawlRunId: ctx.crawlRunId,
    });
    leadsFound++;
  }

  return { itemsFound: comments.length, leadsFound };
}
