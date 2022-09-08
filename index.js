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
                            return node?.innerText
                        } else {
                            return node.querySelector(selectorRule.selector)?.innerText;
                        }
                    case enums.SelectorType.Manual:
                        return selectorRule.selector.toString();
                }

                return null;
                
            }
            let results = [];

            for (let rule of scraperRules) {
                let itemNodes = document.querySelectorAll(rule.items.selector);

                for (let itemNode of itemNodes) {
                    let labelValue = handleSelector(rule.label, itemNode);
                    let dishValue = handleSelector(rule.dish, itemNode);

                    results.push({
                        ...rule,
                        label: {
                            ... rule.label,
                            value: labelValue
                        },
                        dish: {
                            ... rule.dish, 
                            value: dishValue
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
