export interface SourceConfig {
  keywords?: string[];
  targetIndustries?: string[];
  targetEmployeeRange?: string;
  limit?: number;
  urls?: string[];
}

export interface CrawlerContext {
  sourceId: string;
  crawlRunId: string;
  config: SourceConfig;
}

export interface CrawlerResult {
  itemsFound: number;
  leadsFound: number;
}

export type CrawlerFn = (ctx: CrawlerContext) => Promise<CrawlerResult>;
