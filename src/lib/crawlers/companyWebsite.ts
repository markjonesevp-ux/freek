import * as cheerio from "cheerio";
import { isAllowedByRobots, crawlerUserAgent, politeDelay } from "./robots";
import { scoreText, matchesIndustryOrSize } from "./scoring";
import { upsertLeadWithSignals } from "./persist";
import type { CrawlerContext, CrawlerResult } from "./types";

// Fetches a user-supplied list of company URLs (e.g. careers/about pages)
// directly, honoring robots.txt for each host before requesting anything.
export async function crawlCompanyWebsites(ctx: CrawlerContext): Promise<CrawlerResult> {
  const { config } = ctx;
  const urls = config.urls ?? [];

  let itemsFound = 0;
  let leadsFound = 0;

  for (const url of urls) {
    itemsFound++;
    try {
      const allowed = await isAllowedByRobots(url);
      if (!allowed) continue;

      const res = await fetch(url, {
        headers: { "User-Agent": crawlerUserAgent() },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;

      const html = await res.text();
      const $ = cheerio.load(html);
      $("script, style, noscript").remove();
      const text = $("body").text().replace(/\s+/g, " ").trim();
      const title = $("title").text().trim();

      const { signals: keywordSignals, crmDetected } = scoreText(text);
      const firmographicSignals = matchesIndustryOrSize(text, config.targetIndustries, config.targetEmployeeRange);
      const signals = [...keywordSignals, ...firmographicSignals];
      if (signals.length === 0) continue;

      const domain = new URL(url).hostname.replace(/^www\./, "");
      await upsertLeadWithSignals({
        companyName: title || domain,
        domain,
        sourceUrl: url,
        crmDetected,
        signals,
        crawlRunId: ctx.crawlRunId,
      });
      leadsFound++;
    } finally {
      // Be polite: never hammer a host, even across different URLs on the same site.
      await politeDelay(1500);
    }
  }

  return { itemsFound, leadsFound };
}
