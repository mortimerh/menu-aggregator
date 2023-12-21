import { SelectorType, MenuItemType, FilterType } from "../../../shared/enums";
import { ScraperSiteConfig } from "../interfaces";

const config: ScraperSiteConfig ={
    name: "Prince Thai",
    active: true,
    url: "https://www.princethai.nu/",
    scraperRules: [
        {
            items: {
                selectorType: SelectorType.XPath,
                selector: '//main[@id="content"]//h2[contains(text(), "Lunch")]//ancestor::div[contains(@class, "module")][1]/following-sibling::div[contains(@class, "module")]//p',
            },
            label: {
                selectorType: SelectorType.XPath,
                selector: './strong[1]',
                filters: [{
                    type: FilterType.RegExp,
                    argument: '\d{1,2}\.\s(.*)'
                }]
            },
            dish: {
                selectorType: SelectorType.XPath,
                selector: './strong[2]/following::text()',
                filters: [{
                    type: FilterType.RegExp,
                    argument: '([^)]+)'
                }]
            }
        }
    ]
};

module.exports = config;