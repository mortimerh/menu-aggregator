const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const re2 = RegExp; // @fixme actually use re2

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


function menuItemToString(menuItem) {
    if (menuItem.type == enums.ScraperRuleType.Daily && menuItem.day) {
        return `${Object.keys(enums.Days)[menuItem.day - 1]} - ${menuItem.label.value} - ${menuItem.dish.value}`;
    } else {
        return `${menuItem.label.value} - ${menuItem.dish.value}`;
    }
}

async function run(config) {
    const browser = await puppeteer.launch();
    let globalResults = [];

    for (let siteConfig of config.sites.filter(s => s.active)) {
        const page = await browser.newPage();
        await page.goto(siteConfig.url);
        page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

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
                        value: await labelHandle?.evaluate(n => n.textContent)
                    },
                    dish: {
                        ...rule.dish,
                        value: await dishHandle?.evaluate(n => n.textContent)
                    }
                });
            }
        }

        let siteResults = results.map(r => applyFilters(r, config.global?.filters));

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
