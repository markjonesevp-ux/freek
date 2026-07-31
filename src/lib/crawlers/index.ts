import type { CrawlerFn } from "./types";
import { crawlRemoteOk } from "./remoteok";
import { crawlWeWorkRemotely } from "./weworkremotely";
import { crawlHnHiring } from "./hnHiring";
import { crawlCompanyWebsites } from "./companyWebsite";

// Deliberately no LinkedIn provider: scraping LinkedIn breaks its Terms of
// Service and is a well-litigated legal risk (see hiQ Labs v. LinkedIn and
// LinkedIn's ongoing anti-scraping enforcement). If LinkedIn signal is
// needed, go through LinkedIn's official Talent/Sales Navigator APIs or a
// licensed data provider instead of adding a scraper here.
export const CRAWLER_REGISTRY: Record<string, CrawlerFn> = {
  remoteok: crawlRemoteOk,
  weworkremotely: crawlWeWorkRemotely,
  "hn-hiring": crawlHnHiring,
  "company-website": crawlCompanyWebsites,
};

export const PROVIDER_LABELS: Record<string, string> = {
  remoteok: "RemoteOK job listings (public API)",
  weworkremotely: "We Work Remotely job feed (public RSS)",
  "hn-hiring": "Hacker News \"Who is hiring?\" thread (public API)",
  "company-website": "Company websites you specify (careers/about pages)",
};

export const AVAILABLE_PROVIDERS = Object.keys(CRAWLER_REGISTRY);
