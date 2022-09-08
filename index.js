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

        let siteResults = (await page.evaluate(function (scraperRules, enums) {
            const handleSelector = function (selectorRule, node) {
                switch (selectorRule.selectorType) {
                    case enums.SelectorType.CSS:
                        if (selectorRule.selector == "") {
                            return null;
                        } else if (selectorRule.selector == ":scope") {
                            // Return as array to unify return type.
                            return [node];
                        } else {
                            // Return as array to unify return type.
                            return Array.from(node.querySelectorAll(selectorRule.selector));
                        }
                    case enums.SelectorType.XPath:
                        // Use Chrome XPath helper for easy XPath and unified return type, 
                        // https://developer.chrome.com/docs/devtools/console/utilities/#xpath-function
                        return $x(selectorRule.selector, node); 
                    case enums.SelectorType.Manual:
                        // Return as array to unify return type.
                        let el = document.createElement("p");
                        el.innerText = selectorRule.selector;

                        return [el];
                }

                return null;

            }
            let results = [];

            for (let rule of scraperRules) {
                let itemNodes = handleSelector(rule.items, document.body); 

                for (let itemNode of itemNodes) {
                    let labelNode = handleSelector(rule.label, itemNode)?.[0];
                    let dishNode = handleSelector(rule.dish, itemNode)?.[0];
                    
                    results.push({
                        ...rule,
                        label: {
                            ...rule.label,
                            value: labelNode?.innerText
                        },
                        dish: {
                            ...rule.dish,
                            value: dishNode?.innerText
                        }
                    });
                }
            }

            return results;
        }, siteConfig.scraperRules, enums)).map(r => applyFilters(r));

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
