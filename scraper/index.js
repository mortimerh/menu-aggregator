const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const re2 = RegExp; // @fixme actually use re2
const { Storage } = require('@google-cloud/storage');

const myConfig = require('./config');
const enums = require('./common/enums');


function applyFilters(resultItem, globalFilters) {
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

function applyFilter(value, filter) {
    if (!value) {
        return value;
    }

    switch (filter.type) {
        case enums.FilterType.Trim:
            return value.trim();
        case enums.FilterType.RegExp:
            let re = new re2(filter.argument);
            let matches = value.match(re);

            return matches ? matches[1] : null;
    }

    return value;
}

async function evaluateSelector(selectorRule, handle) {
    switch (selectorRule.selectorType) {
        case enums.SelectorType.CSS:
            if (selectorRule.selector == "") {
                return null;
            } else if (selectorRule.selector == ":scope") {
                // Return in array to unify return type.
                return [handle];
            } else {
                return await handle.$$(selectorRule.selector);
            }
        case enums.SelectorType.XPath:
            return await handle.$x(selectorRule.selector);
        case enums.SelectorType.Manual:
            // Return in array to unify return type.
            return [await handle.evaluateHandle((selector) => {
                let el = document.createElement("p");
                el.innerText = selector;

                return el;
            }, selectorRule.selector)];
    }

    return null;
}


function transformMenuItemResult(menuItem) {
    return {
        type: menuItem.type,
        qualifier: (menuItem.type == enums.ScraperRuleType.Daily ? menuItem.day : null),
        label: menuItem.label.value,
        dish: menuItem.dish.value
    };
}

async function save(bucketName, fileName, data) {
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

async function scrapeSites(config) {
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


            for (let rule of siteConfig.scraperRules) {
                let itemHandles = await evaluateSelector(rule.items, page);

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

exports.run = async (req, res) => {
    var results = await scrapeSites(myConfig);
    await save(myConfig.bucketName, myConfig.fileName, results);


    res.status(200).json(results);
}