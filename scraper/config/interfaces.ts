import { FilterType, SelectorType } from "../../shared/enums";

export interface ScraperConfig {
    bucketName: string;
    fileName: string;
    global: {
        filters: ScraperFilterConfig[]
    };
    sites: ScraperSiteConfig[];
}

export interface ScraperFilterConfig {
    type: FilterType;
    argument?: string;
}

export interface ScraperSiteConfig {
    name: string;
    active: true,
    url: "https://restaurangspill.se/",
    scraperRules: ScraperSiteRulesConfig[];
}

export interface ScraperSiteRulesConfig {
    items: ScraperRuleConfig;
    label: ScraperRuleConfig;
    dish: ScraperRuleConfig;
}

export interface ScraperRuleConfig {
    selectorType: SelectorType;
    selector: string;
    filters: ScraperFilterConfig[];
}