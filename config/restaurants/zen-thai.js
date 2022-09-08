const enums = require("../../common/enums");

module.exports = {
    name: "Zen Thai",
    active: true,
    url: "http://www.zenthai.se/",
    scraperRules: [
        {
            type: enums.ScraperRuleType.Weekly,
            items: {
                selectorType: enums.SelectorType.CSS,
                selector: "#page-zones__main-widgets__content > .bk-content-text > p",
            },
            label: {
                selectorType: enums.SelectorType.CSS,
                selector: "strong",
            },
            
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./strong/following::br/following::text()"
            }
        }
    ]
};