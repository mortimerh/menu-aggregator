const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const re2 = RegExp; // @fixme actually use re2

const myConfig = require('./config');
const { FilterType, ScraperRuleType, Days } = require('./enums');


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
        case FilterType.Override:
            return filter.argument;
        case FilterType.Trim:
            return value.trim();
        case FilterType.RegExp:
            let re = new re2(filter.argument);
            let matches = value.match(re);

            return matches ? matches[1] : null;
    }

    return value;
}


function menuItemToString(menuItem) {
    if (menuItem.type == ScraperRuleType.Daily && menuItem.day) {
        return `${Object.keys(Days)[menuItem.day - 1]} - ${menuItem.label.value} - ${menuItem.dish.value}`;
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

        let siteResults = (await page.evaluate(function (scraperRules) {
            const handleSelector = function (selector, node) {
                if (selector == "") {
                    return null;
                } else if (selector == ":scope") {
                    return node
                } else {
                    return node.querySelector(selector);
                }
            }
            let results = [];

            for (let rule of scraperRules) {
                let itemNodes = document.querySelectorAll(rule.items.selector);

                for (let itemNode of itemNodes) {
                    let labelNode = handleSelector(rule.label.selector, itemNode);
                    let dishNode = handleSelector(rule.dish.selector, itemNode);

                    results.push({
                        ...rule,
                        label: {
                            ... rule.label,
                            value: labelNode?.innerText
                        },
                        dish: {
                            ... rule.dish, 
                            value: dishNode?.innerText
                        }
                    });
                }
            }

            return results;
        }, siteConfig.scraperRules)).map(r => applyFilters(r));
        
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
