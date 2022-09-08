const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const re2 = RegExp; // @fixme actually use re2

const myConfig = require('./config');
const enums = require('./enums');


function applyFilters(resultItem) {
    if (resultItem.label.filters) {
        resultItem.label.value = resultItem.label.filters.reduce(applyFilter, resultItem.label.value);
    }
    if (resultItem.dish.filters) {
        resultItem.dish.value = resultItem.dish.filters.reduce(applyFilter, resultItem.dish.value);
    }

    return resultItem;
}

function applyFilter(value, filter) {
    if (! value) {
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


function menuItemToString(menuItem) {
    if (menuItem.type == enums.ScraperRuleType.Daily && menuItem.day) {
        return `${Object.keys(enums.Days)[menuItem.day - 1]} - ${menuItem.label.value} - ${menuItem.dish.value}`;
    } else {
        return `${menuItem.label.value} - ${menuItem.dish.value}`;
    }
}

async function run(config) {
    if (!fs.existsSync(config.screenshotsOutputDir)) {
        fs.mkdirSync(config.screenshotsOutputDir);
    }

    const browser = await puppeteer.launch();
    let globalResults = [];

    for (let siteConfig of config.sites.filter(s => s.active)) {
        const page = await browser.newPage();
        await page.goto(siteConfig.url);
        await page.screenshot({ path: path.join(config.screenshotsOutputDir, siteConfig.name) + ".png" });
        page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

        const evaluateSelector = async function (selectorRule, handle) {
            switch (selectorRule.selectorType) {
                case enums.SelectorType.CSS:
                    if (selectorRule.selector == "") {
                        return null;
                    } else if (selectorRule.selector == ":scope") {
                        // Return as array to unify return type.
                        return [handle];
                    } else {
                        // Return as array to unify return type.
                        return await handle.$$(selectorRule.selector);
                    }
                case enums.SelectorType.XPath:
                    // Use Chrome XPath helper for easy XPath and unified return type, 
                    // https://developer.chrome.com/docs/devtools/console/utilities/#xpath-function
                    return await handle.$x(selectorRule.selector);
                case enums.SelectorType.Manual:
                    // Return as array to unify return type.
                    return [await page.evaluateHandle((selector) => {
                        let el = document.createElement("p");
                        el.innerText = selector;

                        return el;
                    }, selectorRule.selector)];
            }

            return null;
        }
        let results = [];

        for (let rule of siteConfig.scraperRules) {
            let itemHandles = await evaluateSelector(rule.items, page);

            for (let itemHandle of itemHandles) {
                let labelHandle = (await evaluateSelector(rule.label, itemHandle))?.[0];
                let dishHandle = (await evaluateSelector(rule.dish, itemHandle))?.[0];

                results.push({
                    ...rule,
                    label: {
                        ...rule.label,
                        value: await labelHandle?.evaluate(n => n.innerText)
                    },
                    dish: {
                        ...rule.dish,
                        value: await dishHandle?.evaluate(n => n.innerText)
                    }
                });
            }
        }

        let siteResults = results.map(r => applyFilters(r));

        globalResults.push({
            name: siteConfig.name,
            url: siteConfig.url,
            results: siteResults.map(menuItemToString)
        });
    }
    browser.close();

    console.log(globalResults);
}

run(myConfig);
