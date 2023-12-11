import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
const re2 = RegExp; // @fixme actually use re2
import { Storage } from '@google-cloud/storage';

import { config } from './config/index';
import { FilterType, SelectorType, MenuItemType } from '../shared/enums'
import { MenuItem } from '../shared/interfaces'
import { ScraperFilterConfig, ScraperRuleConfig, ScraperConfig } from './config/interfaces';

interface ResultItem { label: { filters: any; value: any; }; dish: { filters: any; value: any; }; }

function applyFilters(resultItem: ResultItem, globalFilters: ScraperFilterConfig[]) {
    globalFilters = globalFilters ?? [];

    const labelFilters = (resultItem.label.filters ?? []).concat(globalFilters);
    if (labelFilters.length > 0) {
        resultItem.label.value = labelFilters.reduce(applyFilter, resultItem.label.value);
    }

    const dishFilters = (resultItem.dish.filters ?? []).concat(globalFilters);
    if (dishFilters.length > 0) {
        resultItem.dish.value = dishFilters.reduce(applyFilter, resultItem.dish.value);
    }

    return resultItem;
}

function applyFilter(value: string, filter: ScraperFilterConfig) {
    if (!value) {
        return value;
    }

    switch (filter.type) {
        case FilterType.Trim:
            return value.trim();
        case FilterType.RegExp:
            if (!filter.argument) {
                console.error("Missing argument for regexp filter. Returning value: " + value);
                return value;
            }

            let re = new re2(filter.argument);
            let matches = value.match(re);

            return matches ? matches[1] : null;
    }

    return value;
}

async function evaluateSelector(selectorRule: ScraperRuleConfig, handle: puppeteer.ElementHandle<Node>): Promise<puppeteer.ElementHandle<Node>[]> {
    switch (selectorRule.selectorType) {
        case SelectorType.CSS:
            if (selectorRule.selector == "") {
                console.warn("Missing CSS selector value. Returning empty array. ");
                return [];
            } else if (selectorRule.selector == ":scope") {
                // Return in array to unify return type.
                return [handle];
            } else {
                return await handle.$$(selectorRule.selector);
            }
        case SelectorType.XPath:
            return await handle.$x(selectorRule.selector);
        case SelectorType.Manual:
            // Create handle and return in array to unify return type.
            return [await handle.evaluateHandle((element, selector) => {
                let p = document.createElement("p");
                p.innerText = selector;

                return p;
            }, selectorRule.selector as string)];
        default:
            console.warn("No handling defined for SelectorType: " + selectorRule.selectorType + "Returning empty array. ");
            return [];
    }
}


function transformMenuItemResult(menuItem: any): MenuItem {
    return {
        type: menuItem.type,
        qualifier: (menuItem.type == MenuItemType.Daily ? menuItem.day : null),
        label: menuItem.label.value,
        dish: menuItem.dish.value
    };
}

async function save(bucketName: string, fileName: string, data: any) {
    // Creates a client
    const storage = new Storage();

    // Convert the data to a JSON string
    const dataJson = JSON.stringify(data);

    // Define the file options
    const fileOptions = {
        contentType: 'application/json',
        gzip: true
    };

    // Upload the file to the bucket
    await storage.bucket(bucketName).file(fileName).save(dataJson, fileOptions);
    console.info(`File ${fileName} uploaded to ${bucketName}.`);
}

async function scrapeSites(config: ScraperConfig) {
    const browser = await puppeteer.launch({
        headless: true
    });
    let globalResults = [];

    for (let siteConfig of config.sites.filter(s => s.active)) {
        let results = [];
        let success = false;

        try {
            const page = await browser.newPage();
            await page.goto(siteConfig.url);
            page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
            const body = await page.$("body");

            if (! body) {
                console.error("Unable to access page body element.");
                continue;
            }

            for (let rule of siteConfig.scraperRules) {
                let itemHandles = await evaluateSelector(rule.items, body);

                for (let itemHandle of itemHandles) {
                    let labelHandle = (await evaluateSelector(rule.label, itemHandle))?.[0];
                    let dishHandle = (await evaluateSelector(rule.dish, itemHandle))?.[0];

                    results.push({
                        ...rule,
                        label: {
                            ...rule.label,
                            value: await labelHandle?.evaluate(n => n.textContent)
                        },
                        dish: {
                            ...rule.dish,
                            value: await dishHandle?.evaluate(n => n.textContent)
                        }
                    });
                }
            }
            success = true;
        } catch (error) {
            console.error("Failed to scrape %s.", siteConfig.name);
            console.error(error);
        }

        let siteResults = results.map(r => applyFilters(r, config.global?.filters));
        globalResults.push({
            name: siteConfig.name,
            url: siteConfig.url,
            menu: siteResults.map(transformMenuItemResult),
            success: success,
            lastScraped: (new Date()).toISOString(),
            lastChanged: "unknown"
        });
    }
    browser.close();

    return globalResults;
}

exports.run = async (req: any, res: any) => {
    var results = await scrapeSites(config);
    await save(config.bucketName, config.fileName, results);


    res.status(200).json(results);
}